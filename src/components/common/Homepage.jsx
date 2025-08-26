import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Brain,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
const Homepage = () => {
  const navigate = useNavigate();
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const inspirationalQuotes = useMemo(
    () => [
      "Học tập là hạt giống của kiến thức, kiến thức là hạt giống của hạnh phúc.",
      "Đầu tư vào kiến thức luôn mang lại lợi nhuận cao nhất.",
      "Tri thức là sức mạnh vượt qua mọi giới hạn.",
      "Học tập không phải là đích đến, mà là hành trình của cả cuộc đời.",
      "Dù bạn học chậm thế nào, bạn vẫn nhanh hơn người không học gì cả.",
      "Khó khăn trong học tập chính là cơ hội để trí tuệ phát triển.",
      "Người thành công là người dám đứng lên sau mỗi lần vấp ngã.",
      "Một ngày không học tập là một ngày lãng phí.",
      "Việc học cũng giống như chèo thuyền ngược dòng, không tiến ắt lùi.",
      "Kiến thức là tài sản không ai có thể đánh cắp từ bạn.",
      "Sự kiên trì là chìa khóa mở cánh cửa thành công.",
      "Thành công không phải là điểm đến cuối cùng, mà là cả quá trình phấn đấu.",
      "Giáo dục là vũ khí mạnh mẽ nhất để thay đổi thế giới.",
      "Càng học càng thấy mình ngu ngốc, đó là bắt đầu của trí tuệ.",
      "Thất bại không phải là ngã, mà là từ chối đứng dậy.",
      "Bạn không cần phải vĩ đại để bắt đầu, nhưng bạn cần phải bắt đầu để trở nên vĩ đại.",
      "Kiên trì là nửa đường đến thành công.",
      "Không ai sinh ra đã là thiên tài, chỉ có những người chăm chỉ.",
      "Khi bạn nghĩ đến việc bỏ cuộc, hãy nghĩ đến lý do bạn bắt đầu.",
      "Mỗi bước đi nhỏ đều đưa bạn gần hơn đến mục tiêu.",
      "Trí tuệ đến từ học hỏi. Sự tự tin đến từ kinh nghiệm.",
      "Thời gian và kiên nhẫn là hai người thầy vĩ đại nhất.",
      "Trên con đường học vấn không có con đường nào là ngắn cả.",
      "Chìa khóa thành công là tập trung vào mục tiêu, không phải vào chướng ngại.",
      "Tri thức không chỉ là sức mạnh mà còn là tự do.",
      "Học từ hôm qua, sống cho hôm nay, hy vọng cho ngày mai.",
      "Tôi không thất bại, tôi chỉ tìm ra 10.000 cách không hiệu quả.",
      "Việc học tập cũng giống như chèo thuyền ngược dòng: không tiến ắt lùi.",
      "Học tập là ánh sáng, không học tập là bóng tối.",
      "Thành công là đi từ thất bại này đến thất bại khác mà không mất đi nhiệt huyết.",
    ],
    []
  );
  useEffect(() => {
    if (!isTyping) return;

    const currentQuote = inspirationalQuotes[currentQuoteIndex];

    if (displayedText.length < currentQuote.length) {
      const typingTimeout = setTimeout(() => {
        setDisplayedText(currentQuote.substring(0, displayedText.length + 1));
      }, 50);

      return () => clearTimeout(typingTimeout);
    } else {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, currentQuoteIndex, inspirationalQuotes]);

  useEffect(() => {
    if (isTyping) return;

    const pauseTimeout = setTimeout(() => {
      setCurrentQuoteIndex((prevIndex) =>
        prevIndex === inspirationalQuotes.length - 1 ? 0 : prevIndex + 1
      );
      setDisplayedText("");
      setIsTyping(true);
    }, 3000);

    return () => clearTimeout(pauseTimeout);
  }, [isTyping, inspirationalQuotes]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Helmet>
        <title>EduNest Học tập không có rào cản - Trang Chủ</title>
        <meta
          name="description"
          content="Trang web cung cấp nội dung học tập miễn phí, dễ tiếp cận cho tất cả mọi người."
        />
        <meta
          name="keywords"
          content="học tập, giáo dục, miễn phí, không giới hạn"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://edu-space-dkn7.vercel.app/" />
      </Helmet>
      <div className="min-h-screen transition-colors duration-300 dark:bg-gray-950 bg-white">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 ">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 max-w-xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                  Học tập không có rào cản
                </h1>

                <div className="h-20 sm:h-24 flex items-center">
                  <div className="relative">
                    <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium italic">
                      {displayedText}
                      <span
                        className={`ml-1 inline-block w-1 h-5 sm:h-6 bg-blue-500 ${
                          isTyping ? "animate-blink" : "opacity-0"
                        }`}
                      ></span>
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="group relative overflow-hidden bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate("/classes")}
                    arial-label="start learning"
                  >
                    <span className="absolute right-full top-0 h-full w-full bg-white/20 transition-all group-hover:right-0 duration-500"></span>
                    <span className="relative dark:text-white">
                      Bắt đầu học ngay
                    </span>
                  </Button>
                </div>
              </div>

              <div className="hidden lg:block relative">
                <div className="relative h-[500px] w-full">
                  <div className="absolute right-0 top-0 bg-blue-500 rounded-full w-72 h-72 opacity-10 dark:opacity-20 blur-3xl"></div>
                  <div className="absolute left-20 bottom-20 bg-indigo-500 rounded-full w-60 h-60 opacity-10 dark:opacity-20 blur-3xl"></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-80 h-80">
                      {/* Animation cho hình ảnh hero */}
                      <div
                        className="absolute w-72 h-72 rounded-full border-2 border-dashed border-blue-300 dark:border-blue-700 animate-spin-slow"
                        style={{ animationDuration: "30s" }}
                      ></div>
                      <div
                        className="absolute w-56 h-56 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-indigo-300 dark:border-indigo-700 animate-reverse-spin"
                        style={{ animationDuration: "20s" }}
                      ></div>

                      <div className="absolute top-0 right-0 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg animate-float">
                        <div className="flex items-center space-x-2">
                          <Lightbulb className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm font-medium">
                            Học mọi lúc, mọi nơi
                          </span>
                        </div>
                      </div>

                      <div
                        className="absolute bottom-10 left-0 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg animate-float"
                        style={{ animationDelay: "1s" }}
                      >
                        <div className="flex items-center space-x-2">
                          <Users className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium">
                            Cộng đồng học tập
                          </span>
                        </div>
                      </div>

                      <div
                        className="absolute top-1/3 left-1/4 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-lg animate-float"
                        style={{ animationDelay: "1.5s" }}
                      >
                        <div className="flex items-center space-x-2">
                          <Brain className="w-5 h-5 text-orange-500" />
                          <span className="text-sm font-medium">
                            Trau dồi kĩ năng
                          </span>
                        </div>
                      </div>

                      <div className="w-60 h-60 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 rounded-full mx-auto flex items-center justify-center shadow-xl">
                        <div className="w-56 h-56 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center">
                          <Sparkles className="w-20 h-20 text-blue-600 dark:text-blue-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hình nền trang trí */}
          <div className="absolute bottom-0 left-0 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="text-white dark:text-gray-950 fill-current"
            >
              <path d="M0,288L60,272C120,256,240,224,360,218.7C480,213,600,235,720,224C840,213,960,171,1080,160C1200,149,1320,171,1380,181.3L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
            </svg>
          </div>
        </section>

        {/* Tại sao chọn chúng tôi */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
                Giá trị cốt lõi
              </Badge>
              <h2 className="text-3xl font-bold mb-4">Tại sao chọn EduNest?</h2>
              <p className="text-gray-700 dark:text-gray-300 max-w-xl sm:max-w-2xl mx-auto leading-relaxed">
                Chúng tôi cam kết mang đến trải nghiệm học tập chất lượng cao,
                hoàn toàn miễn phí và dễ tiếp cận cho tất cả mọi người.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: (
                    <Sparkles className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  ),
                  title: "Nội dung chất lượng cao",
                  description:
                    "Tất cả khóa học đều được biên soạn kỹ lưỡng và cập nhật liên tục bởi các giảng viên hàng đầu.",
                },
                {
                  icon: (
                    <Users className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  ),
                  title: "Cộng đồng học tập",
                  description:
                    "Tham gia vào cộng đồng học tập sôi nổi, nơi bạn có thể kết nối và chia sẻ kiến thức với những người học khác",
                },
                {
                  icon: (
                    <Brain className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  ),
                  title: "Trau dồi kỹ năng",
                  description:
                    "Học tập qua các bài giảng chất lượng, rèn luyện kỹ năng thực tế và áp dụng ngay vào công việc.",
                },
                {
                  icon: (
                    <Lightbulb className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  ),
                  title: "Học tập linh hoạt",
                  description:
                    "Tự do học tập vào bất kỳ thời điểm nào, bất kỳ nơi đâu với khóa học được thiết kế phù hợp với lịch trình bận rộn",
                },
                {
                  icon: (
                    <BookOpen className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  ),
                  title: "Thư viện tài nguyên",
                  description:
                    "Truy cập kho tài liệu, sách điện tử và nguồn tài nguyên phong phú để hỗ trợ quá trình học tập của bạn",
                },
                {
                  icon: (
                    <TrendingUp className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                  ),
                  title: "Lộ trình cá nhân hóa",
                  description:
                    "Lộ trình học tập được gợi ý dựa trên mục tiêu và sở thích của bạn, giúp bạn đạt được kết quả tốt nhất",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-md group"
                >
                  <div className="w-16 h-16 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-50 dark:bg-gray-900 pt-20 pb-10 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <Sparkles className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-xl">EduNest</span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Nền tảng học tập trực tuyến miễn phí hàng đầu, cung cấp kiến
                  thức chất lượng cao cho tất cả mọi người.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-6">Khám phá</h3>
                <ul className="space-y-3">
                  {[
                    "Cộng đồng",
                    "Diễn đàn",
                    "Blog",
                    "Tài nguyên",
                    "Sự kiện",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        onClick={() => scrollToTop()}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-6">Thông tin</h3>
                <ul className="space-y-3">
                  {[
                    "Về chúng tôi",
                    "Đối tác",
                    "Trợ giúp",
                    "Chính sách bảo mật",
                    "Điều khoản sử dụng",
                  ].map((item) => (
                    <li key={item}>
                      <a
                        onClick={() => scrollToTop()}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        href="#"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-6">Liên hệ</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <ul className="space-y-3">
                      {[
                        "Huỳnh Long Nhật",
                        "Phạm Minh Quang",
                        "Đoàn Võ Nguyên",
                        "Huỳnh Văn Giảng",
                        "Dương Thanh Lịch",
                      ].map((item) => (
                        <li key={item}>
                          <a
                            onClick={() => scrollToTop()}
                            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                </ul>
                {/* <Chatbot/> */}
                <div className="mt-6"></div>
              </div>
            </div>
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
              <p>© 2025 EduNest. Tất cả các quyền được bảo lưu.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Homepage;
