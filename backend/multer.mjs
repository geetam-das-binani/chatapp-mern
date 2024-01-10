import multer from "multer";
import fs from "fs";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		fs.mkdir("./uploads/", (err) => {
			cb(null, "./uploads/");
		});
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, file.fieldname + "-" + uniqueSuffix);
	},
});

export const upload = multer({ storage: storage });
