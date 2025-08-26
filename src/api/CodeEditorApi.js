
import axios from "axios";
import { Buffer } from "buffer";

// Hàm mã hóa/giải mã base64
const encode = (str) => Buffer.from(str, "binary").toString("base64");
const decode = (str) => Buffer.from(str, "base64").toString();

// Gửi code lên Judge0 API và trả về token
export const postSubmission = async (
  rapidAPIKey,
  rapidAPIHost,
  language_id,
  source_code,
  stdin
) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions",
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Key": rapidAPIKey,
      "X-RapidAPI-Host": rapidAPIHost,
    },
    data: JSON.stringify({
      language_id,
      source_code,
      stdin,
    }),
  };

  try {
    const res = await axios.request(options);
    return res.data.token;
  } catch (error) {
    console.error("Error posting submission:", error);
    return null;
  }
};

// Lấy kết quả từ Judge0 API bằng token
export const getOutput = async (rapidAPIKey, rapidAPIHost, token) => {
  const options = {
    method: "GET",
    url: `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "X-RapidAPI-Key": rapidAPIKey,
      "X-RapidAPI-Host": rapidAPIHost,
    },
  };

  try {
    const res = await axios.request(options);
    if (res.data.status_id <= 2) {
      // Nếu chưa hoàn thành, đợi rồi gọi lại
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await getOutput(rapidAPIKey, rapidAPIHost, token);
    }
    return res.data;
  } catch (error) {
    console.error("Error getting output:", error);
    return null;
  }
};

// Hàm tổng hợp chạy code thông qua Judge0 API
export const runCodeAPI = async (
  rapidAPIKey,
  rapidAPIHost,
  language_id,
  code,
  inputText
) => {
  const source_code = encode(code);
  const stdin = encode(inputText);
  const token = await postSubmission(
    rapidAPIKey,
    rapidAPIHost,
    language_id,
    source_code,
    stdin
  );
  if (!token) return null;
  const result = await getOutput(rapidAPIKey, rapidAPIHost, token);
  if (!result) return null;

  const status_name = result?.status?.description || "Unknown";
  const decoded_output = result.stdout ? decode(result.stdout) : "";
  const decoded_compile_output = result.compile_output
    ? decode(result.compile_output)
    : "";
  const decoded_error = result.stderr ? decode(result.stderr) : "";

  let final_output = "";
  if (result.status_id !== 3) {
    final_output =
      decoded_compile_output === "" ? decoded_error : decoded_compile_output;
  } else {
    final_output = decoded_output;
  }

  return {
    status: result.status_id === 3 ? "success" : "error",
    status_name,
    output: final_output.trim(),
  };
};
