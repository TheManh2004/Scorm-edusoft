const { useState, useEffect } = React;
const { Layout, Menu } = antd;
const { Sider, Content, Header } = Layout;

const App = () => {
  const [selectedKey, setSelectedKey] = useState("1");
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedView, setSelectedView] = useState("session"); // Trạng thái mới để xác định mục đang được chọn

  useEffect(() => {
    fetch('../json/course.json')  
      .then((response) => response.json())
      .then((data) => setSessions(data.sessions)) // Lưu dữ liệu vào state
      .catch((error) => console.error('Lỗi khi tải dữ liệu:', error));
  }, []);

  const handleMenuClick = (e) => {
    setSelectedKey(e.key);
    if (e.key === "4" || e.key === "5") {
      setSelectedView(e.key === "4" ? "grades" : "notes"); // Thay đổi view khi chọn "Grades" hoặc "Notes"
    } else {
      const session = sessions.find((session) => session.id === parseInt(e.key));
      setSelectedSession(session);
      setSelectedView("session"); // Reset lại view khi chọn buổi học
    }
  };

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider width={300} theme="light">
        <div className="p-5">
          <img
            className="w-32 pb-4"
            src="https://edusoft.vn/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.9b1832b8.png&w=256&q=75"
            alt="logo"
          />
          <p className="font-medium">English for Common Interactions in the Workplace: Basic Level</p>
          <p className="text-gray-500">Pontificia Universidad Católica de Chile</p>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          style={{ height: "100%", borderRight: 0}}
        >
          <Menu.SubMenu key="sub1" title="Course Material">
            {sessions.map((session) => (
              <Menu.Item key={session.id}>
                {session.title}
              </Menu.Item>
            ))}
          </Menu.SubMenu>
          <Menu.Item key="4" className="hover:bg-gray-200 font-bold">
            Grades
          </Menu.Item>
          <Menu.Item key="5" className="hover:bg-gray-200 font-bold">
            Notes
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: "24px" }}>
        <Content
          style={{
            background: "#fff",
            padding: "20px",
            marginRight: "250px",
            borderRadius:"10px"
          }}
        >
          {selectedView === "session" ? (
            selectedSession ? (
              <div>
                <h2>{selectedSession.title}</h2>
                {selectedSession.topics.map((topic) => (
                  <div key={topic.id}>
                    <h3>{topic.title}</h3>
                    <ul>
                      {topic.lessons.map((lesson) => (
                        <li key={lesson.id}>{lesson.title}</li>
                      ))}
                    </ul>
                  </div>
                ))}
                <a href="./dashboard-client.html">Get Started</a>
              </div>
            ) : (
              <p>Vui lòng chọn buổi học</p>
            )
          ) : selectedView === "grades" ? (
            <div>
              <h2>Grades Section</h2>
              <p>Here is the grades content for the course.</p>
            </div>
          ) : (
            <div>
              <h2>Notes Section</h2>
              <p>Here are some important notes for the course.</p>
            </div>
          )}
        </Content>
        <Sider
          width={250}
          theme="light"
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            height: "100vh",
          }}
        >
          <div style={{ padding: "20px" }} className="bg-blue-600 rounded-lg mt-6">
            <h3>Nội dung thêm</h3>
            <p>
              Đây là phần dành cho nội dung thêm như ghi chú hoặc thông tin bổ sung.
            </p>
          </div>
          <div style={{ padding: "20px" }} className="bg-blue-600 rounded-lg mt-6">
            <h3>Nội dung thêm</h3>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aliquam explicabo tenetur laborum odio, unde error quas quaerat reprehenderit fugit, magni sed quisquam aut beatae et ut doloremque voluptatem recusandae. Maiores!
        Tempore magnam inventore saepe qui, fuga distinctio odio dolore sed quisquam ut perspiciatis aliquid consequuntur laudantium quae porro placeat et consequatur labore dicta, soluta numquam alias. Distinctio a minus enim?
        Dicta animi explicabo corrupti accusamus fugiat doloribus libero, quidem cupiditate rem, laborum illo, temporibus nobis eum aperiam! Commodi doloremque recusandae iure a culpa, molestias ipsa fugit ut error accusantium facilis.
        Inventore asperiores culpa facere quae? Neque excepturi nesciunt velit et. Illum illo ipsum molestias dolorem deserunt ad mollitia tempore repellat labore harum perferendis architecto amet impedit quasi, fugit doloremque soluta.</p>
          </div>
        </Sider>
      </Layout>
    </Layout>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
