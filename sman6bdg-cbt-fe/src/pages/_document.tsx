import Document, {
  Html,
  Head,
  Main,
  NextScript
} from 'next/document'

import type { DocumentContext } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps (ctx: DocumentContext): Promise<any> {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render (): JSX.Element {
    return (
      <Html className="dark">
        <Head>
          <link rel="preconnect" href="https://fonts.bunny.net"></link>
          <link
            href="https://fonts.bunny.net/css2?family=Nunito:wght@400;600;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="font-sans antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
