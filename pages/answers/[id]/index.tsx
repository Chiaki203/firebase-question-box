import Layout from '../../../components/Layout'
import {Answer} from '../../../models/Answer'
import {Question} from '../../../models/Question'
import Head from 'next/head'
import TwitterShareButton from '../../../components/TwitterShareButton'
import Link from 'next/link'

type Props = {
  answer: Answer
  question: Question
}

function getDescription(answer:Answer) {
  const body = answer.body.trim().replace(/[\r\n]/g, '')
  if (body.length < 140) {
    return body
  }
  return body.substring(0, 140) + '...'
}

export default function AnswersShow(props:Props) {
  const description = getDescription(props.answer)
  const ogpImageUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/api/answers/${props.answer.id}/ogp`
  return (
    <Layout>
      <Head>
        <meta name="description" key="description" content={description}/>
        <meta 
          property="og:description"
          key="ogDescription"
          content={description}
        />
        <meta property="og:image" key="ogImage" content={ogpImageUrl}/>
        <meta name="twitter:card" key="twitterCard" content="summary_large_image"/>
        <meta name="twitter:image" key="twitterImage" content={ogpImageUrl}/>
      </Head>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <>
            <div className="card">
              <div className="card-body">
                {props.question.body}
              </div>
            </div>
            <section className="text-left mt-4">
              <h2 className="h4 text-center">回答</h2>
              <div className="card">
                <div className="card-body text-left">
                  {props.answer.body}
                </div>
              </div>
            </section>
            <div className="my-3 d-flex justify-content-center">
              <TwitterShareButton
                url={`${process.env.NEXT_PUBLIC_WEB_URL}/answers/${props.answer.id}`}
                text={props.answer.body}/>
            </div>
            <p className="text-center my-5">
            <Link href="/users/me" >
              <a className="btn btn-link">自分もみんなに質問してもらおう！</a>
            </Link>
          </p>
          </>
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps(context:any) {
  // console.log(context)
  const {query} = context
  const res = await fetch(process.env.API_URL + `/api/answers/${query.id}`)
  const json = await res.json()
  return {props: json}
}