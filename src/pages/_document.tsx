import Document, { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          {/* Netlify Widget */}
          <script async src="https://identity.netlify.com/v1/netlify-identity-widget.js" />
          <script async src="https://cdn.cookielaw.org/scripttemplates/otSDKStub.js" type="text/javascript" charSet="UTF-8" data-domain-script="bc3778e9-b551-49ea-a0d5-73ec623344eb-test" ></script>


        </Head>
        <body>
          <Main />
          <NextScript />
          <script dangerouslySetInnerHTML={{
            __html: `
              if (window.netlifyIdentity) {
                window.netlifyIdentity.on("init", user => {
                  if (!user) {
                    window.netlifyIdentity.on("login", () => {
                      document.location.href = "/admin/";
                    });
                  }
                });
              }
          `}} />
          <script async id="oneTrustWrapperCall" type="text/javascript" dangerouslySetInnerHTML={{
            __html: `
                      function OptanonWrapper() { }
                      const privacyCenterButtons = document.querySelectorAll('#cookiePref')
                      privacyCenterButtons.forEach(function(button) {
                          button.addEventListener("click", function(e) {
                              e.preventDefault();
                              OneTrust.ToggleInfoDisplay()
                          })
                      })
          `}}></script>
        </body>

      </Html>
    )
  }
}

export default MyDocument