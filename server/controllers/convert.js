const { exec } = require("child_process");
const path = require("path");

exports.wordToPdf = (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      message: "File not uploaded"
    });
  }

  const inputFile = req.file.path;
  const outputDir = path.join(__dirname, "../converted");

  const command = `"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --headless --convert-to pdf "${inputFile}" --outdir "${outputDir}"`;

  exec(command, (error , stdout , stderr) => {
    console.log("stdout:", stdout);
    console.log("stderr:", stderr);


    if (error) {
      console.error(error);
      return res.status(500).json({
        message: "Conversion failed"
      });
    }

    const pdfFile =
      path.basename(inputFile, path.extname(inputFile)) + ".pdf";

    res.json({
      message: "File converted successfully",
      file: `/converted/${pdfFile}`
    });
  });
};