const e = React.createElement;


function App() {
  const handleClick = () => {
    alert('Bạn vừa nhấn nút!');
  };

  return e(
    'div',
    { className: 'container' },
    e('h1', null, 'Chào mừng đến với React thuần!'),
    e('button', { onClick: handleClick }, 'Nhấn tôi')
  );
}
console.log(React.version);

// Render component App vào phần tử có id="root"
ReactDOM.render(e(App), document.getElementById('root'));