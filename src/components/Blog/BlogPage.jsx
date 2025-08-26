import { ChevronRight, Clock, User } from "lucide-react";

const BlogPage = () => {
  // Mock blog data
  const featuredPosts = [
    {
      id: 1,
      title: "Trí tuệ nhân tạo và cách nó đang thay đổi thế giới công nghệ",
      excerpt:
        "Khám phá cách AI đang định hình lại cách chúng ta tương tác với công nghệ và tiềm năng của nó trong tương lai.",
      category: "Trí tuệ nhân tạo",
      date: "10/03/2025",
      author: "Nguyễn Văn A",
      image: "https://via.placeholder.com/600x400",
      readTime: "5 phút đọc",
    },
    {
      id: 2,
      title: "Hướng dẫn React toàn diện cho người mới bắt đầu năm 2025",
      excerpt:
        "Một hướng dẫn từng bước về cách bắt đầu với React, các hooks phổ biến và thực hành tốt nhất.",
      category: "Phát triển Web",
      date: "05/03/2025",
      author: "Trần Thị B",
      image: "https://via.placeholder.com/600x400",
      readTime: "8 phút đọc",
    },
    {
      id: 3,
      title: "Bảo mật không gian mạng trong kỷ nguyên làm việc từ xa",
      excerpt:
        "Tìm hiểu về các thách thức bảo mật mới trong thời đại làm việc từ xa và cách bảo vệ dữ liệu của bạn.",
      category: "Bảo mật",
      date: "01/03/2025",
      author: "Lê Văn C",
      image: "https://via.placeholder.com/600x400",
      readTime: "6 phút đọc",
    },
  ];

  const recentPosts = [
    {
      id: 4,
      title: "Các xu hướng thiết kế UI/UX hàng đầu cho năm 2025",
      excerpt:
        "Khám phá xu hướng thiết kế UI/UX mới nhất đang định hình trải nghiệm người dùng trong năm nay.",
      category: "UI/UX",
      date: "09/03/2025",
      author: "Phạm Thị D",
      image: "https://via.placeholder.com/400x250",
      readTime: "4 phút đọc",
    },
    {
      id: 5,
      title: "Khám phá sức mạnh của TypeScript trong các dự án lớn",
      excerpt:
        "Tại sao TypeScript trở thành lựa chọn hàng đầu cho các dự án quy mô lớn và cách tích hợp nó.",
      category: "Lập trình",
      date: "07/03/2025",
      author: "Hoàng Văn E",
      image: "https://via.placeholder.com/400x250",
      readTime: "7 phút đọc",
    },
    {
      id: 6,
      title: "Docker và Kubernetes: Hướng dẫn cơ bản cho DevOps",
      excerpt:
        "Tìm hiểu cách triển khai ứng dụng hiệu quả với Docker và Kubernetes trong quy trình DevOps.",
      category: "DevOps",
      date: "05/03/2025",
      author: "Võ Thị F",
      image: "https://via.placeholder.com/400x250",
      readTime: "9 phút đọc",
    },
    {
      id: 7,
      title: "Next.js 14: Các tính năng mới và cách sử dụng chúng",
      excerpt:
        "Khám phá những tính năng mới nhất trong Next.js 14 và cách áp dụng chúng vào dự án của bạn.",
      category: "Framework",
      date: "03/03/2025",
      author: "Nguyễn Văn G",
      image: "https://via.placeholder.com/400x250",
      readTime: "5 phút đọc",
    },
    {
      id: 8,
      title: "Blockchain và tương lai của Web3",
      excerpt:
        "Tìm hiểu về blockchain và cách nó đang định hình tương lai của Internet với Web3.",
      category: "Blockchain",
      date: "01/03/2025",
      author: "Trần Văn H",
      image: "https://via.placeholder.com/400x250",
      readTime: "6 phút đọc",
    },
    {
      id: 9,
      title: "Tối ưu hóa hiệu suất cho ứng dụng React",
      excerpt:
        "Các kỹ thuật và công cụ để tối ưu hóa hiệu suất của ứng dụng React của bạn.",
      category: "Hiệu suất",
      date: "28/02/2025",
      author: "Lê Thị I",
      image: "https://via.placeholder.com/400x250",
      readTime: "7 phút đọc",
    },
  ];
  const categories = [
    "Tất cả",
    "Trí tuệ nhân tạo",
    "Phát triển Web",
    "Phát triển Mobile",
    "DevOps",
    "Bảo mật",
    "Blockchain",
    "UI/UX",
    "Điện toán đám mây",
    "Dữ liệu lớn",
    "Machine Learning",
  ];

  const popularTags = [
    "React",
    "JavaScript",
    "TypeScript",
    "AI",
    "Python",
    "Cybersecurity",
    "AWS",
    "Docker",
    "GraphQL",
    "Node.js",
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <main className="container mx-auto px-4 py-8 dark:bg-gray-900">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="rounded-2xl overflow-hidden dark:bg-gray-800 bg-indigo-50">
            <div className="grid md:grid-cols-2 gap-8 p-8">
              <div className="flex flex-col justify-center">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 dark:text-white text-gray-900">
                  Khám phá thế giới{" "}
                  <span className="dark:text-blue-400 text-indigo-600">
                    Công nghệ
                  </span>
                </h1>
                <p className="text-lg mb-6 dark:text-gray-300 text-gray-700">
                  Nơi cập nhật những tin tức mới nhất, xu hướng và kiến thức
                  chuyên sâu về công nghệ thông tin, lập trình và mọi thứ về IT.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#featured"
                    className="px-6 py-3 rounded-lg font-medium text-white dark:bg-blue-600 dark:hover:bg-blue-700 bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    Khám phá ngay
                  </a>
                  <a
                    href="#categories"
                    className="px-6 py-3 rounded-lg font-medium dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 bg-white text-gray-900 border border-gray-300 hover:bg-gray-100 transition"
                  >
                    Danh mục
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-full h-64 md:h-80 rounded-xl flex items-center justify-center text-4xl font-bold dark:bg-gradient-to-r dark:from-blue-800 dark:to-blue-900 dark:text-blue-200 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                  EduNest
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section id="categories" className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold dark:text-white">Danh mục</h2>
            <a
              href="#"
              className="flex items-center text-sm font-medium dark:text-blue-400 dark:hover:text-blue-300 text-indigo-600 hover:text-indigo-700"
            >
              Xem tất cả <ChevronRight size={16} />
            </a>
          </div>

          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <a
                key={index}
                href="#"
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  index === 0
                    ? "dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 bg-indigo-600 text-white hover:bg-indigo-700"
                    : "dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {category}
              </a>
            ))}
          </div>
        </section>

        {/* Featured Posts */}
        <section id="featured" className="mb-16">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            Bài viết nổi bật
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <div
                key={post.id}
                className="rounded-xl overflow-hidden shadow-lg transition transform hover:-translate-y-1 dark:bg-gray-800 bg-white"
              >
                <div className="h-48 bg-gray-300 relative dark:bg-gray-700">
                  <div className="absolute inset-0 flex items-center justify-center font-bold dark:text-gray-300">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-sm mb-2 dark:text-blue-400 text-indigo-600 font-medium">
                    {post.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="mb-4 dark:text-gray-300 text-gray-600">
                    {post.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-1">
                      <Clock
                        size={16}
                        className="dark:text-gray-400 text-gray-500"
                      />
                      <span className="text-sm dark:text-gray-400 text-gray-500">
                        {post.readTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User
                        size={16}
                        className="dark:text-gray-400 text-gray-500"
                      />
                      <span className="text-sm dark:text-gray-400 text-gray-500">
                        {post.author}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Latest Posts with sidebar */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="lg:w-2/3">
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">
                Bài viết mới nhất
              </h2>
              <div className="grid sm:grid-cols-2 gap-8">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="rounded-xl overflow-hidden shadow-md transition transform hover:-translate-y-1 dark:bg-gray-800 bg-white"
                  >
                    <div className="h-40 bg-gray-300 relative dark:bg-gray-700">
                      <div className="absolute inset-0 flex items-center justify-center font-bold dark:text-gray-300">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-xs mb-2 dark:text-blue-400 text-indigo-600 font-medium">
                        {post.category}
                      </div>
                      <h3 className="text-lg font-bold mb-2 dark:text-white">
                        {post.title}
                      </h3>
                      <p className="text-sm mb-4 dark:text-gray-300 text-gray-600">
                        {post.excerpt}
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-1">
                          <Clock
                            size={14}
                            className="dark:text-gray-400 text-gray-500"
                          />
                          <span className="dark:text-gray-400 text-gray-500">
                            {post.readTime}
                          </span>
                        </div>
                        <span className="dark:text-gray-400 text-gray-500">
                          {post.date}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <a
                  href="#"
                  className="px-6 py-3 rounded-lg font-medium dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white bg-indigo-600 hover:bg-indigo-700 text-white transition"
                >
                  Xem thêm bài viết
                </a>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            <div className="sticky top-24 dark:bg-gray-800 bg-white rounded-xl shadow-md p-6 dark:shadow-none">
              {/* About widget */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 dark:text-white">
                  Về TechInsight
                </h3>
                <p className="dark:text-gray-300 text-gray-600 mb-4">
                  TechInsight là blog chia sẻ kiến thức và tin tức mới nhất về
                  công nghệ thông tin, lập trình và mọi thứ liên quan đến IT.
                </p>
                <a
                  href="#"
                  className="inline-block dark:text-blue-400 dark:hover:text-blue-300 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Tìm hiểu thêm
                </a>
              </div>

              {/* Popular tags */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 dark:text-white">
                  Tags phổ biến
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, index) => (
                    <a
                      key={index}
                      href="#"
                      className="px-3 py-1 rounded-full text-xs font-medium dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                    >
                      {tag}
                    </a>
                  ))}
                </div>
              </div>

              {/* Newsletter */}
              <div className="dark:bg-gray-700 bg-gray-100 rounded-xl p-5">
                <h3 className="text-xl font-bold mb-2 dark:text-white">
                  Đăng ký nhận bản tin
                </h3>
                <p className="text-sm mb-4 dark:text-gray-300 text-gray-600">
                  Nhận những bài viết mới nhất về công nghệ thông tin và lập
                  trình.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="w-full px-4 py-2 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white bg-white border border-gray-300 outline-none"
                  />
                  <button className="w-full px-4 py-2 rounded-lg font-medium dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white bg-indigo-600 hover:bg-indigo-700 text-white transition">
                    Đăng ký
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
