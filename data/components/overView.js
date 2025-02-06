const { useState, useEffect } = React;
const { Layout, Menu } = antd;
const { Sider, Content, Header } = Layout;

const App = () => {
  const [selectedKey, setSelectedKey] = useState("1");
  const [selectedSession, setSelectedSession] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedView, setSelectedView] = useState("session"); // Trạng thái mới để xác định mục đang được chọn

  useEffect(() => {
    fetch('../json/course.json')  
      .then((response) => response.json())
      .then((data) => {
        setSessions(data.sessions);
        setModules(data.sessions); // Lưu danh sách module
      })
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
    <Layout style={{ height: "max-content" }}>
      <Sider
  width={300}
  theme="light"
  style={{
    position: "fixed", // Cố định
    left: 0,
    top: 0,
    height: "100vh",
    background: "#fff",
    borderRight: "1px solid #ddd",
  }}
>
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
          <Menu.SubMenu key="sub1" title="Course Material" style={{ maxHeight: "300px", overflowY: "auto",overflowX: "hidden" }}>
            
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
    marginLeft: "300px", // Dịch sang phải tránh bị Sider trái đè
    marginRight: "250px", // Dịch sang trái tránh bị Sider phải đè
    minHeight: "100vh",
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
              <div id="module-list">
                <h2>Danh sách Module</h2>
                {modules.map((session, index) => (
                  <div key={session.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50 cursor-pointer">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-semibold">Module {index + 1}: {session.title}</h4>
                    </div>
                    <div className="lesson-list mt-3 space-y-2">
                      {session.topics.map((topic) => (
                        <p key={topic.id} className="pl-4 text-gray-700 text-sm">• {topic.title}</p>
                      ))}
                    </div>
                    
                    
                  </div>
                  
                  
                ))}
              </div>
              
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
    position: "fixed", // Cố định
    right: 0,
    top: 0,
    height: "100vh",
    background: "#fff",
    borderLeft: "1px solid #ddd",
    padding: "20px",
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
        Tempore magnam inventore saepe qui, fuga distinctio odio dolore sed quisquam ut perspiciatis aliquid consequuntur laudantium quae porro placeat et consequatur labore dicta, soluta numquam alias. Distinctio a minus enim?</p>
          </div>
        </Sider>
      </Layout>
    </Layout>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
