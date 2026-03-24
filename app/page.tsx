export default function Home() {
  // Redirect handled via HTML meta refresh for static hosting compatibility
  return (
    <>
      <meta httpEquiv="refresh" content="0;url=dashboard.html" />
      <p>Redirecting to dashboard...</p>
    </>
  )
}