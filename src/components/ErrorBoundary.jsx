import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트합니다.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // 에러 리포팅 서비스에 에러를 로깅할 수 있습니다.
        console.error('ErrorBoundary에서 에러를 포착했습니다:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // 폴백 UI를 커스터마이징할 수 있습니다.
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#fff',
                    padding: '20px',
                    textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '20px'
                    }}>🍳</div>
                    <h2 style={{
                        color: '#ff6b35',
                        marginBottom: '16px',
                        fontSize: '24px'
                    }}>앗! 요리하다가 실수했네요</h2>
                    <p style={{
                        color: '#666',
                        marginBottom: '24px',
                        fontSize: '16px',
                        lineHeight: '1.5'
                    }}>
                        일시적인 오류가 발생했습니다.<br />
                        페이지를 새로고침하면 다시 정상적으로 이용하실 수 있습니다.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: '#ff6b35',
                            color: 'white',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        페이지 새로고침
                    </button>

                    {/* 개발 환경에서만 에러 상세 정보 표시 */}
                    {process.env.NODE_ENV === 'development' && (
                        <details style={{ marginTop: '20px', textAlign: 'left' }}>
                            <summary style={{ cursor: 'pointer', color: '#ff6b35' }}>
                                개발자 정보 (에러 상세)
                            </summary>
                            <pre style={{
                                backgroundColor: '#f5f5f5',
                                padding: '10px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                overflow: 'auto',
                                maxWidth: '80vw'
                            }}>
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary; 