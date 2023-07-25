const config = require("@/config");
const amqp = require("amqp-connection-manager");

class ProducerService {
  /** @type {amqp.AmqpConnectionManager} */
  #conn;
  /** @type {amqp.ChannelWrapper} */
  #chan;

  static queues = {
    EXPORT_PLAYLIST: "export:playlist"
  };

  async initialize() {
    this.#conn = amqp.connect(config.rabbitmq.url);
    this.#conn.on("connect", ({ url }) =>
      console.log(`AMQP connected: ${url}`)
    );
    this.#conn.on("disconnect", ({ err }) =>
      console.log(`AMQP disconnected: ${err}`)
    );

    this.#chan = this.#conn.createChannel({
      json: true,
      setup(channel) {
        return Promise.all(
          Object.values(ProducerService.queues).map((q) =>
            channel.assertQueue(q, { durable: true })
          )
        );
      }
    });
  }

  /**
   * @param {string} queue
   * @param {object} message
   */
  async sendMessage(queue, message) {
    if (!this.#conn.isConnected()) await this.initialize();

    try {
      await this.#chan.sendToQueue(queue, message);
    } catch (e) {
      this.#chan.close();
      this.#conn.close();
    }
  }
}

module.exports = ProducerService;
