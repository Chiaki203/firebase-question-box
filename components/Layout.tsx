import {ToastContainer} from 'react-toastify'
import Head from 'next/head'
import Link from 'next/link'

export default function Layout({children}) {
  const title = 'My質問回答サービス'
  const description = '質問と回答を行えるサービスです。'
  const ogpImageUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/images/card.png`
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" key="description" content={description}/>
        <meta property="og:title" key="ogTitle" content={title}/>
        <meta property="og:site_name" key="ogSiteName" content={title}/>
        <meta
          property="og:description"
          key="ogDescription"
          content={description}
        />
        <meta property="og:image" key="ogImage" content={ogpImageUrl}/>
        <meta name="twitter:card" key="twitterCard" content="summary"/>
        <meta name="twitter:image" key="twitterImage" content={ogpImageUrl}/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      </Head>
      <nav
        className="navbar navbar-expand-lg navbar-light mb-3"
        style={{backgroundColor: '#e3f2fd'}}
      >
        <div className="container">
          <div className="mr-auto">
            <Link href="/">
              <a className="navbar-brand">
                My質問サービス
              </a>
            </Link>
          </div>
          {/* <form className="d-flex">
            <button className="btn btn-outline-primary" type="submit">
              Search
            </button>
          </form> */}
        </div>
      </nav>
      <div className="container">{children}</div>
      <ToastContainer/>
      <nav className="navbar fixed-bottom navbar-light bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center w-100">
            <i className="material-icons">menu</i>
            <Link href="/questions/received">
              <a>
                <i className="material-icons">home</i>
              </a>
            </Link>
            <Link href="/users/me">
              <a>
                <i className="material-icons">person</i>
              </a>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  )
}