import Head from 'next/head'
import Link from 'next/link'
import {useAuthentication} from '../hooks/authentication'

export default function Home() {
  const {user} = useAuthentication()
  console.log(user)
  return (
    <div>
      <Head>
        <title>Page2</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <p>{user?.uid || 'not logged in'}</p>
      <Link href="/">
        <a>Go back</a>
      </Link>
    </div>
  )
}