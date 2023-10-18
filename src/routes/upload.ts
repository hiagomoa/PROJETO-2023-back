import express from "express";
import multer from "multer";
const router = express.Router();
import multerConfig from '../config/upload'
import { S3StorageProvider } from "../shared/providers/r2/upload";
const storageService = new S3StorageProvider()
const upload = multer({storage : multerConfig.storage});
router.post("/", upload.array('file'), async (req, res) => {
  const { files } = req;
  const allFiles= files as any[]
 if(allFiles?.length){
  for await (const file of allFiles) {
    await storageService.save(file.filename)
  }
 }
  return res.status(200).send('ok')
} );

export default router;