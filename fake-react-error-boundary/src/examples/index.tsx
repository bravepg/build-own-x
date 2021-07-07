import React from 'react';
import ErrorBoundary from '../ErrorBoundary';

// class Demo extends React.Component {
//   state = {
//     number: 1,
//   }
//   // constructor(props: any) {
//   //   super(props);
//   //   this.setup();
//   // }
//   componentDidMount() {
//     throw new Error('Demo');
//   }
//   // setup() {
//   //   console.log('this', this);
//   //   this.componentDidMount = function() {
//   //     console.log(3);
//   //   }
//   // }
//   handleClick = () => {
//     if (this.state.number > 5) {
//       throw new Error('Demo');
//     }
//     this.setState({
//       number: this.state.number + 1,
//     });
//   }

//   render() {
//     return <div onClick={this.handleClick}>demo-{this.state.number}</div>;
//   }
// }

// console.log('Demo', Demo);

interface FallbackProps {
  error: Error | null;
  resetErrorboundary: (...args: Array<unknown>) => void;
}


// class ErrorFallback extends React.Component<FallbackProps> {
//   render() {
//     return (
//       <>
//         ErrorFallback
//         <button onClick={this.props.resetErrorboundary}>click</button>
//       </>
//     )
//   }
// }

// class App extends React.Component {
//   onError = () => {
//     console.error('error');
//   }
//   onReset = () => {
//     console.log('重置成功');
//   }
//   render() {
//     return (
//       <ErrorBoundary FallbackComponent={ErrorFallback} onError={this.onError} onReset={this.onReset}>
//         <Demo />
//       </ErrorBoundary>
//     )
//   }
// }

function ErrorFallback({ error, resetErrorboundary }: FallbackProps) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error?.message}</pre>
      <button onClick={resetErrorboundary}>Try again</button>
    </div>
  )
}

function Bomb(): JSX.Element {
  throw new Error('💥 CABOOM 💥')
}

function App() {
  const [explode, setExplode] = React.useState(false)
  return (
    <div>
      <button onClick={() => {
        setExplode(e => !e)
        console.log(explode);
      }}>toggle explode</button>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => setExplode(false)}
        resetKeys={[explode]}
      >
        {explode ? <Bomb /> : null}
      </ErrorBoundary>
    </div>
  )
}

export default App;
