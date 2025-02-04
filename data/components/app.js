const { useState } = React;
const { Layout, Menu } = antd;
const { Sider, Content } = Layout;

const App = () => {
    const [selectedKey, setSelectedKey] = useState("1");
    

    const contentData = {
        "1": { title: "Module 1", description: "Nội dung Module 1" },
        "2": { title: "Module 2", description: "Nội dung Module 2" },
        "3": { title: "Grades", description: "Chi tiết về điểm số" },
        "4": { title: "Notes", description: "Ghi chú của bạn" },
    };

    return (
        <Layout style={{ height: "100vh" }}>
            <Sider width={250} theme="light">
                <Menu
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    onClick={(e) => setSelectedKey(e.key)}
                >
                    <Menu.SubMenu key="sub1" title="Course Material">
                        <Menu.Item key="1">Module 1</Menu.Item>
                        <Menu.Item key="2">Module 2</Menu.Item>
                    </Menu.SubMenu>
                    <Menu.Item key="3">Grades</Menu.Item>
                    <Menu.Item key="4">Notes</Menu.Item>
                </Menu>
            </Sider>
            <Layout style={{ padding: "24px" }}>
                <Content style={{ background: "#fff", padding: "20px" }}>
                    <h2>{contentData[selectedKey].title}</h2>
                    <p>{contentData[selectedKey].description}</p>
                </Content>
            </Layout>
        </Layout>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
