import React, { ErrorInfo } from 'react';

// 官网用法
class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    // 更新 state，使下一次更新 UI 时渲染错误
    return {
      hasError: true,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log('error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

class Demo extends React.Component {
  componentDidMount() {
    throw new Error('error');
  }
  render() {
    return <>App</>;
  }
}

console.log('Demo', Demo);

export function App() {
  return (
    <ErrorBoundary>
      <Demo />
    </ErrorBoundary>
  )
}
