// images mime types
exports.imageMimeTypes = ["image/jpeg", "image/png"];
// document mime types
exports.docMimeTypes = [
    "application/msword",
    "application/pdf",
    "text/plain",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];
// video mime type
exports.vidMimeTypes = [
    "vidoe/3gpp",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-ms-wmv",
    "video/x-flv",
    "video/mp4",
    "video/MP2T",
    "application/x-mpegURL"
];

// files sizes type
exports.fileSizes = ['B', 'KB', 'MB', 'GB', 'TB'];

// pagination configuration
exports.paginate = {
    limit : 3
}

exports.productData = [
  "id",
  "unique_id",
  "name",
  "price",
  "quantity",
  "category",
  "brand",
  "type",
  "discount_rate",
  "discount_status"
];