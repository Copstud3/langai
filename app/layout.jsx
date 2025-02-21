import "./globals.css";



export const metadata = {
  title: "AI Text Processor",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  const translatorToken = process.env.NEXT_PUBLIC_TRANSLATOR_TOKEN;
  const summarizerToken = process.env.NEXT_PUBLIC_SUMMARIZER_TOKEN;
  const languageDetectionToken = process.env.NEXT_PUBLIC_LANGUAGE_DETECTION_TOKEN;
  return (
    <html lang="en">
      <head>
        {translatorToken ? (
          <meta httpEquiv="origin-trial" content={translatorToken} />
        ) : (
          <meta name="error" content="Translator token missing" />
        )}
        {summarizerToken ? (
          <meta httpEquiv="origin-trial" content={summarizerToken} />
        ) : (
          <meta name="error" content="Summarizer token missing" />
        )}
      </head>
      <body
        className={`font-inter`}
      >
        {children}
      </body>
    </html>
  );
}
