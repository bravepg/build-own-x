import React, { ErrorInfo } from 'react';
// https://github.com/Haixiang6123/my-react-error-bounday
// https://stackoverflow.com/questions/58123398/when-to-use-jsx-element-vs-reactnode-vs-reactelement
// An ReactElement is a plain object describing a component instance or DOM node and its desired properties
// A ReactNode is a ReactElement, a ReactFragment, a string, a number or an array of ReactNodes, or null, or undefined, or a boolean:
// JSX.Element is a ReactElement, with the generic type for props and type being any.


// 出错后显示的元素类型
type FallbackElement = React.ReactElement<unknown, string | React.FC | typeof React.Component> | null;

// 出错后显示元素的 props
interface FallbackProps {
  error: Error | null;
  resetErrorboundary: (...args: Array<unknown>) => void;
}

declare function FallbackRender(
  props: FallbackProps,
): FallbackElement;

interface IErrorBoundaryProps {
  fallback?: FallbackElement; // 一段 ReactElement
  // typeof 获取变量声明
  fallbackRender?: typeof FallbackRender;
  FallbackComponent?: React.ComponentType<FallbackProps>;
  onError?: (error: Error, info: string) => void;
  onReset?: () => void;
  resetKeys?: Array<unknown>;
  onResetKeysChange?: (
    prevResetKeys: Array<unknown> | undefined,
    resetKeys: Array<unknown> | undefined,
  ) => void
}
interface IErrorBoundaryState {
  error: Error | null;
}

// React.PropsWithChildren
// 相当于
// type PropsWithChildren<T> = T & {
//   children?: ReactNode
// }

// 检查 resetKeys 是否有变化
const changedArray = (a: Array<unknown> = [], b: Array<unknown> = []) => {
  return a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<IErrorBoundaryProps>, IErrorBoundaryState> {
  state = {
    error: null,
  };
  updatedWithError = false;

  static getDerivedStateFromError(error: Error) {
    return {
      error,
    };
  }

  reset() {
    this.updatedWithError = false;
    this.setState({ error: null });
  }

  resetErrorboundary = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }

    this.reset();
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo.componentStack);
    }
  }

  componentDidMount() {
    const { error } = this.state;

    if (error !== null) {
      this.updatedWithError = true;
    }
  }

  componentDidUpdate(prevProps: Readonly<React.PropsWithChildren<IErrorBoundaryProps>>) {
    const { error } = this.state;
    const { resetKeys, onResetKeysChange } = this.props;
    console.log(error, this.updatedWithError, prevProps.resetKeys, resetKeys, changedArray(prevProps.resetKeys, resetKeys));

    // 非常巧妙的处理，防止由于第一次 error 的 render 导致重新 render
    if (error !== null && !this.updatedWithError) {
      this.updatedWithError = true;
      return;
    }

    if (error !== null && changedArray(prevProps.resetKeys, resetKeys)) {
      if (onResetKeysChange) {
        onResetKeysChange(prevProps.resetKeys, resetKeys);
      }
      this.reset();
    }
  }

  render() {
    const { error } = this.state;
    const { fallback, fallbackRender, FallbackComponent } = this.props;

    if (error !== null) {
      const props: FallbackProps = {
        error,
        resetErrorboundary: this.resetErrorboundary,
      }
      if (React.isValidElement(fallback)) {
        return fallback;
      } else if (typeof fallbackRender === 'function') {
        return fallbackRender(props);
      } else if (FallbackComponent) {
        return <FallbackComponent {...props} />
      }
      throw new Error('ErrorBoundary 组件需要传入 fallback, fallbackRender, FallbackComponent 其中一个');
    }
    return this.props.children;
  }
}

function withErrorBoundary<P>(Component: React.ComponentType<P>, errorBoundaryProps: IErrorBoundaryProps): React.ComponentType<P> {
  const Wrapped: React.ComponentType<P> = (props) => {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }

  // DevTools 显示的组件名
  const name = Component.displayName || Component.name || 'Unknown';
  Wrapped.displayName = `withErrorBoundary(${name})`;

  return Wrapped;
}

function useErrorHandler<P = Error>(
  givenError: P | undefined | null,
): React.Dispatch<React.SetStateAction<P | null>> {
  const [error, setError] = React.useState<P | null>(null);
  if (givenError) throw givenError; // 初始有错误时，直接抛出
  if (error) throw error; // 后来再有错误，也直接抛出
  return setError; // 返回开发者可手动设置错误的钩子
}

export { withErrorBoundary, useErrorHandler };
export default ErrorBoundary;
