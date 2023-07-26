const config = require("@/config");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const slugify = require("slugify");

class StorageService {
  #client;

  constructor() {
    this.#client = new S3Client({
      region: config.s3.region,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey
      },
      endpoint: config.s3.endpoint
    });
  }

  /**
   * @param {string} filename
   * @param {import("node:stream").Readable} contents
   */
  async storeAlbumCover(filename, contents) {
    const path = "images/album/covers";
    const key = `${path}/${Date.now()}_${slugify(filename, { lower: true })}`;

    let buf = contents._data;

    await this.#client.send(
      new PutObjectCommand({
        Bucket: config.s3.bucketName,
        Key: key,
        Body: buf
      }),
      { requestTimeout: 4000 }
    );

    return `${config.s3.endpoint}/${key}`;
  }
}

module.exports = StorageService;
