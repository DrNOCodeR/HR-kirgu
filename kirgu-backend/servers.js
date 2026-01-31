const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");
const { sql, poolPromise } = require("./db");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on ${PORT}`));




/* ===== ПАПКА ДЛЯ ФАЙЛОВ ===== */
const UPLOADS_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

/* ===== НАСТРОЙКА MULTER ===== */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* ===== РОУТ ЗАГРУЗКИ ===== */
app.post("/upload", upload.single("resume"), (req, res) => {
  console.log("FILE:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "Файл не получен" });
  }

  res.json({
    message: "Файл успешно загружен",
    filePath: req.file.path,
  });
});




//get all vacancies records

app.get("/api/vacancies", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Vacancies");
    console.log(result);

    res.status(200).json({
      success: true,
      empData: result.recordset,
    });
  } catch (error) {
    console.log(`Error`, error);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message,
    });
  }
});

//get all applicants records

app.get("/api/applications", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM Applications");
    console.log(result);

    res.status(200).json({
      success: true,
      empData: result.recordset,
    });
  } catch (error) {
    console.log(`Error`, error);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message,
    });
  }
});

// Get applicant by id

app.get("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid id",
      });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM Applications WHERE ID = @ID");
    console.log(result);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Application details not found",
      });
    }

    res.status(200).json({
      success: true,
      empData: result.recordset,
    });
  } catch (error) {
    console.log(`Error`, error);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message,
    });
  }
});

// Get vacancy by id

app.get("/api/vacancies/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid id",
      });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM Vacancies WHERE ID = @ID");
    console.log(result);

    if (result.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vacanciy details not found",
      });
    }

    res.status(200).json({
      success: true,
      empData: result.recordset,
    });
  } catch (error) {
    console.log(`Error`, error);
    res.status(500).json({
      success: false,
      message: "Server error, try again",
      error: error.message,
    });
  }
});

//Add new applicant

app.post("/api/applications", async (req, res) => {
  try {
    const { VacancyId, Fullname, Email, Phone, Message, ResumePath } = req.body;
    if (
      !VacancyId ||
      !Fullname ||
      !Email ||
      !Phone ||
      !Message ||
      !ResumePath
    ) {
      return res.status(404).json({
        success: false,
        message: "All fields are required",
      });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("VacancyId", sql.Int, VacancyId)
      .input("Fullname", sql.VarChar, Fullname)
      .input("Email", sql.VarChar, Email)
      .input("Phone", sql.VarChar, Phone)
      .input("Message", sql.VarChar, Message)
      .input("ResumePath", sql.VarChar, ResumePath)
      .query(
        "INSERT INTO Applications(VacancyId,Fullname,Email,Phone,Message,ResumePath) VALUES (@VacancyId,@Fullname,@Email,@Phone,@Message,@ResumePath)"
      );
    res.status(200).json(result.rowsAffected);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

//Add new vacancy

app.post("/api/vacancies", async (req, res) => {
  try {
    const { Title, City, SalaryMin, SalaryMax, Description } = req.body;

    if (!Title || !City || !Description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const pool = await poolPromise;
    await pool
      .request()
      .input("Title", sql.NVarChar(200), Title)
      .input("City", sql.NVarChar(100), City)
      .input("SalaryMin", sql.Int, Number(SalaryMin))
      .input("SalaryMax", sql.Int, Number(SalaryMax))
      .input("Description", sql.NVarChar(sql.MAX), Description).query(`
        INSERT INTO Vacancies
        (Title, City, SalaryMin, SalaryMax, Description)
        VALUES
        (@Title, @City, @SalaryMin, @SalaryMax, @Description)
      `);

    res.status(201).json({ success: true });
  } catch (error) {
    console.error("SQL ERROR:", error);
    res.status(500).json(error.message);
  }
});

//Update existing vacancy

app.put("/api/vacancies/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { Title, City, SalaryMin, SalaryMax, Description } = req.body;

    if (!Title || !City || !SalaryMin || !SalaryMax || !Description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("Id", sql.Int, Number(id))
      .input("Title", sql.NVarChar(200), Title)
      .input("City", sql.NVarChar(100), City)
      .input("SalaryMin", sql.Int, Number(SalaryMin))
      .input("SalaryMax", sql.Int, Number(SalaryMax))
      .input("Description", sql.NVarChar(sql.MAX), Description)
      .query(
        "UPDATE Vacancies SET Title=@Title, City=@City, SalaryMin=@SalaryMin, SalaryMax=@SalaryMax, Description=@Description WHERE Id=@Id"
      );

    res.status(200).json(result.rowsAffected);
  } catch (error) {
    console.error("SQL ERROR:", error);
    res.status(500).json(error.message);
  }
});

// Delete vacancy by id

app.delete("/api/vacancies/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid id",
      });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM Vacancies WHERE ID = @ID");
    console.log(result);
    res.status(200).json(result.rowsAffected);
  } catch (error) {
    console.log(`Error`, error);
    res.status(500).json(error.message);
  }
});

// Delete applicant by id

app.delete("/api/applications/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid id",
      });
    }

    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM Applications WHERE ID = @ID");
    console.log(result);
    res.status(200).json(result.rowsAffected);
  } catch (error) {
    console.log(`Error`, error);
    res.status(500).json(error.message);
  }
});
