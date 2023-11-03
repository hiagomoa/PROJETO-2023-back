import multer from "multer";
import { resolve } from "path";

export const tmpFolder = resolve(__dirname, "..", "..", "tmp");

export default {
  tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      // const fileHash = ulid();
      // const fileIndex = (request?.files?.length || 0) as number;
      // const calcNumber = fileIndex >= 10 ? fileIndex : `0${fileIndex}`;
      // const SpaceWhiteRemoved = file.originalname.split(".").pop();
      // const filename = `${fileHash}-${file.originalname}`;
      const a = request.query!.name! || "";
      return callback(null, a as string);
    },
  }),
};
