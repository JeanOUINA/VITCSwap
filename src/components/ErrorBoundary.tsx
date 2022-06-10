import {ErrorBoundary} from "react-error-boundary"
import React from "react"

function ErrorFallback({error, resetErrorBoundary}) {
  return <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
    </div>
}

export default function(props:{
    children: React.ReactNode
}){
    return <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // reset the state of your app so the error doesn"t happen again
      }}
    >
      {props.children}
    </ErrorBoundary>
}