export const codeExamples = {
  javascript: `// JavaScript solution: Tính tổng hai số a và b
function sumTwoNumbers(a, b) {
  return a + b;
}

// Đọc input từ command-line arguments (Node.js)
const a = parseInt(process.argv[2], 10) || 0;
const b = parseInt(process.argv[3], 10) || 0;
console.log(sumTwoNumbers(a, b));`,

  python: `# Python solution: Tính tổng hai số a và b
def sum_two_numbers(a, b):
    return a + b

a = int(input("Nhập a: "))
b = int(input("Nhập b: "))
print(sum_two_numbers(a, b))`,

  cpp: `// C++ solution: Tính tổng hai số a và b
#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << (a + b) << endl;
    return 0;
}`,

  java: `// Java solution: Tính tổng hai số a và b
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.print("Nhập a: ");
        int a = scanner.nextInt();
        System.out.print("Nhập b: ");
        int b = scanner.nextInt();
        System.out.println("Tổng: " + (a + b));
        scanner.close();
    }
}`,
};

export const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "application/x-pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "video/mp4",
  "video/webm",
  "video/ogg",
  "application/javascript", // file .js
  "text/javascript", // file .js
  "text/plain", // file .txt (fallback)
  "text/x-c", // file .c
  "text/x-c++", // file .cpp
  "text/x-sql", // file .sql
  "text/x-python", // file .py
  "text/x-java-source", // file .java
  "text/html", // file .html
  "text/css", // file .css
  "application/json", // file .json
  "application/xml", // file .xml
  "text/x-php", // file .php (một số hệ thống cũng dùng "application/x-httpd-php")
  "text/x-ruby", // file .rb
  "text/x-go", // file .go
  "text/x-rust", // file .rs
];

export const mapExamType = (type) => {
  switch (type) {
    case "test":
      return "Bài kiểm tra thường xuyên";
    case "quiz":
      return "Trắc nghiệm";
    case "midterm":
      return "Giữa kì";
    case "final":
      return "Cuối kì";
    case "assignment":
      return "Bài tập";
    default:
      return type;
  }
};

export const getBadgeColor = (type) => {
  switch (type) {
    case "test":
      return "bg-blue-500 text-white";
    case "quiz":
      return "bg-green-500 text-white";
    case "midterm":
      return "bg-yellow-500 text-white";
    case "final":
      return "bg-red-500 text-white";
    default:
      return "bg-gray-500 text-white";
  }
};

export const viewFileOnline = (fileUrl) => {
  if (!fileUrl) return;
  const ext = fileUrl.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
    // Mở ảnh trong tab mới
    window.open(fileUrl, "_blank");
  } else if (["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(ext)) {
    // Mở video trong tab mới
    window.open(fileUrl, "_blank");
  } else if (ext === "pdf") {
    // Sử dụng Google Docs Viewer để xem PDF
    try {
      const encodedUrl = encodeURIComponent(fileUrl);
      const viewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
      const newWindow = window.open("about:blank", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Đang tải tài liệu...</title>
              <style>
                body, html { height: 100%; margin: 0; padding: 0; overflow: hidden; }
                .container { display: flex; flex-direction: column; height: 100%; }
                .loading { padding: 20px; text-align: center; }
                iframe { flex: 1; border: none; width: 100%; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="loading" id="loading">
                  <h2>Đang tải tài liệu...</h2>
                  <p>Nếu tài liệu không hiển thị trong vài giây, hãy 
                    <a href="${fileUrl}" download>tải xuống</a> để xem trực tiếp.
                  </p>
                </div>
                <iframe src="${viewerUrl}" onload="document.getElementById('loading').style.display='none'"></iframe>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      } else {
        window.open(fileUrl, "_blank");
      }
    } catch (error) {
      console.error("Lỗi khi mở file PDF:", error);
      window.open(fileUrl, "_blank");
    }
  } else if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) {
    // Sử dụng Office Online Viewer cho file Office
    try {
      const encodedUrl = encodeURIComponent(fileUrl);
      window.open(
        `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`,
        "_blank"
      );
    } catch (error) {
      window.open(fileUrl, "_blank");
    }
  } else if (["js", "c", "cpp", "sql"].includes(ext)) {
    // Xem các file code (.js, .c, .cpp, .sql) trong tab mới với định dạng <pre>
    fetch(fileUrl)
      .then((res) => res.text())
      .then((text) => {
        const newWindow = window.open("about:blank", "_blank");
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head>
                <title>File ${ext.toUpperCase()} Viewer</title>
                <style>
                  body, html { margin: 0; padding: 0; }
                  pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    padding: 20px;
                    font-family: monospace;
                    background: #f7f7f7;
                  }
                </style>
              </head>
              <body>
                <pre>${text}</pre>
              </body>
            </html>
          `);
          newWindow.document.close();
        }
      })
      .catch((error) => {
        console.error("Error loading file", error);
        window.open(fileUrl, "_blank");
      });
  } else {
    // Các loại file khác - mở trực tiếp
    window.open(fileUrl, "_blank");
  }
};
