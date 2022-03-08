import { ServerStyleSheets } from '@mui/styles'
import Document, { Html, Head, Main, NextScript, } from 'next/document'
import React from 'react';

export default class MyDocument extends Document{
    render(){
        return (
            <Html lang="en">
                <Head>
                  <meta charSet='utf-8' />
                  <link rel="preconnect" href="https://fonts.googleapis.com" />
                  <link href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Public+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

MyDocument.getInitialProps = async (ctx) => {
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () => {
      return originalRenderPage({
        enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
        enhanceComponent: (Component) => Component,
      });
    };
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
    };
};