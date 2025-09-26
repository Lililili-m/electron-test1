import './ErrorPage.css';

function ErrorPage() {
  return (
    <div className="error-page">
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h1 className="error-title">连接失败</h1>
        <p className="error-description">
          无法连接到 React 开发服务器（端口 5234）
        </p>
        <p className="error-description">请检查是否已启动 React 开发服务器</p>
      </div>
    </div>
  );
}

export default ErrorPage;
