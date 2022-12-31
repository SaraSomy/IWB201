/*Get Values for Insert User */
var students = [];
var ID = 1;
const form = document.getElementById("regist-Form");
const selectCourse = document.getElementById("course-select");
const sortTable = document.getElementById("sort-table");
let userNameInput = document.getElementById("userName");
let stdNameInput = document.getElementById("studentName");
let mobileInput = document.getElementById("mobile");
let captchaInput = document.getElementById("captcha");
/* Get Values For Json & Convert */
let container = document.getElementById("json-container");
const converter = document.getElementById("convert-json2html");


let textArea = "";
let captchaValue = "";
let errorMessage = "";
let spanError = "";

function generateCaptchaCode() {
  let generatedVal = btoa(Math.random() * 1000000);
  captchaValue = generatedVal.substring(0, 5 + Math.random() * 5);
}

const handleCaptcha = async () => {
  let captcha = captchaValue
    .split("")
    .map((char) => {
      const rotateValue = -20 + Math.trunc(Math.random() * 30);
      console.log(`transform :rotate(${rotateValue} deg)`, "ffff");
      return `<span style="transform :rotate(${rotateValue} deg) !important;text-decoration: line-through">${char}</span>`;
    })
    .join("");

  document.getElementById("captcha-code").innerHTML = captcha;
};
const handleMobileEx = (mobile) => {
  let valid = true;
  let message = "";
  let localNumbers = mobile.slice(0, 2);

  if (mobile.length != 10 || localNumbers != 09 || isNaN(mobile)) {
    message = "الرقم غير مطابق للأرقام السورية";
    valid = false;
  }
  return { valid, message };
};

const resetErrorMessages = () => {
  spanError = "";
  document.getElementById("userNameError").innerHTML = spanError;
  document.getElementById("studentNameError").innerHTML = spanError;
  document.getElementById("mobileError").innerHTML = spanError;
  document.getElementById("captchaError").innerHTML = spanError;
  return true;
};

// after each submit all values will pass here to check validation , if return false , adding not complete
function validateFields(values) {
  let errorMsg = resetErrorMessages();
  const { DOB, captcha, mobile, studentName, userName } = values;
  var regNameEx = /^[\u0621-\u064A\040]+$/gi;
/*Regex For Date*/
  var regDateEx =
    /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/g;
  let dataMobile = handleMobileEx(mobile);

  const { valid, message } = dataMobile;
  var regStdNameEx = /^([A-Z][a-z]*)_([0-9].+[0-9])( .+)?/g;
/*Regex For  User Name*/
  if (!regNameEx.test(userName)) {
    spanError = `<span> اسم الطالب فقط بالاحرف العربية دون رموز$%^&*@#!_</span>`;
    document.getElementById("userNameError").innerHTML = spanError;
    userNameInput.focus();
    return false;
  }
/*Regex For Student Name*/
  if (!regStdNameEx.test(studentName)) {
    spanError = `<span>اسم المستخدم يجب أن يكون (انكليزي حرف كبير) Student_123456</span>`;
    document.getElementById("studentNameError").innerHTML = spanError;
    stdNameInput.focus();
    return false;
  }

  if (!valid) {
    spanError = `<span>${message}</span>`;
    document.getElementById("mobileError").innerHTML = spanError;

    mobileInput.focus();
    return false;
  }
/*Regex For Captcha*/
  if (captcha != captchaValue) {
    spanError = `<span>رمز الكابتشا غير مطابق للرمز المولد</span>`;
    document.getElementById("captchaError").innerHTML = spanError;

    captchaInput.focus();
    return false;
  }
  if (!regDateEx.test(DOB)) {
    dateInput.focus();
    return false;
  }

  return true;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
/* Vlidation */
  let formFields = e.currentTarget;

  /* validateFields() */
  let formData = new FormData(formFields);
  let formDataObject = Object.fromEntries(formData.entries());
  formDataObject["ID"] = ID;

  let isValidate = validateFields(formDataObject);

  if (isValidate) {
    students.push(formDataObject);
    ID += 1;

    tableFromStudents(students);
    generateCaptchaCode();
    await handleCaptcha();
    form.reset();
  } else return;
});

selectCourse.addEventListener("change", async (e) => {
  e.preventDefault();

  let option = e.target.value;
  let filterStd = [];
  if (option == "all") {
    tableFromStudents(students);
  } else {
    filterStd = students.filter((st) => st.course == option);
    tableFromStudents(filterStd);
  }
});

sortTable.addEventListener("change", async (e) => {
  e.preventDefault();
  // if no option selected , default value will be sort by Id
  let option = e.target.value;
  let sortedStd = [];
  if (option == "ID") {
    tableFromStudents(students);
  } else {
    sortedStd = sortByKey(students, option);

    tableFromStudents(sortedStd);
  }
});

const tableFromStudents = (students) => {
  var studentsTable = [];
  let obj = {};
  let contentsOfCell = document.querySelector("#students-cells");
  let cell = "";

  students.map((item) => {
    {
      obj["studentId"] = item.ID;
      obj["userName"] = item.userName;
      obj["studentName"] = item.studentName;
      obj["course"] = item.course;
    }
    studentsTable.push(obj);
    obj = {};
  });

  for (let st of studentsTable) {
    cell += `
         <tr>
           
            <td>${st.studentId}</td>
            <td>${st.userName}</td>
            <td>${st.studentName}</td>
            <td>${st.course}</td>
         </tr>
      `;
  }

  contentsOfCell.innerHTML = cell;
};

window.addEventListener("load", async () => {
  generateCaptchaCode();
  await handleCaptcha();

  tableFromStudents();
});

/* this function sorts array of object depend on key passes which presents student name or course type */
function sortByKey(array, key) {
  return array.sort(function (a, b) {
    var x = a[key];
    var y = b[key];

    if (typeof x == "string") {
      x = ("" + x).toLowerCase();
    }
    if (typeof y == "string") {
      y = ("" + y).toLowerCase();
    }

    return x < y ? -1 : x > y ? 1 : 0;
  });
}

converter.addEventListener("click", async (e) => {
  e.preventDefault();

  let rowsLength = students.length * 15;

  textArea = `<textarea name="comment" form="usrform" rows='${rowsLength}' cols="50">  ${JSON.stringify(
    students,
    undefined,
    4
  )}</textarea>`;
  container.innerHTML = textArea;
});
