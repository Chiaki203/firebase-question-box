import {useState, useEffect, useRef} from 'react'
import {Question} from '../../models/Question'
import Layout from '../../components/Layout'
import {
  collection,
  DocumentData,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
  where,
} from 'firebase/firestore'
import {useAuthentication} from '../../hooks/authentication'
import dayjs from 'dayjs'
import Link from 'next/link'

export default function QuestionsReceived() {
  const {user} = useAuthentication()
  console.log('user', {user})
  const [questions, setQuestions] = useState<Question[]>([])
  const [isPaginationFinished, setIsPaginationFinished] = useState(false)
  const scrollContainerRef = useRef(null)
  function createBaseQuery() {
    const db = getFirestore()
    return query(
      collection(db, 'questions'),
      where('receiverUid', '==', user.uid),
      orderBy('createdAt', 'desc'),
      limit(8)
    )
  }
  function appendQuestions(snapshot:QuerySnapshot<DocumentData>) {
    const gotQuestions = snapshot.docs.map(doc => {
      const question = doc.data() as Question
      question.id = doc.id
      return question
    })
    setQuestions(questions.concat(gotQuestions))
    console.log('add questions', gotQuestions)
  }
  async function loadQuestions() {
    const snapshot = await getDocs(createBaseQuery())
    if (snapshot.empty) {
      setIsPaginationFinished(true)
      console.log('load questions pagination finished')
      return 
    }
    appendQuestions(snapshot)
  }
  async function loadNextQuestions() {
    if (questions.length === 0) {
      return
    }
    const lastQuestion = questions[questions.length - 1]
    console.log('last q', lastQuestion)
    console.log('last q created at', lastQuestion.createdAt)
    const snapshot = await getDocs(
      query(createBaseQuery(), startAfter(lastQuestion.createdAt))
    )
    if (snapshot.empty) {
      setIsPaginationFinished(true)
      console.log('load next questions pagination finished')
      return
    }
    appendQuestions(snapshot)
  }
  function onScroll() {
    // console.log('scroll')
    if (isPaginationFinished) {
      return
    }
    // console.log('pagination finished?')
    const container = scrollContainerRef.current
    if (container === null) {
      return
    }
    // console.log('container exists?')
    const rect = container.getBoundingClientRect()
    // console.log('rect', rect)
    if (rect.top + rect.height > window.innerHeight) {
      return
    }
    console.log('client rect?')
    loadNextQuestions()
  }
  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [questions, scrollContainerRef.current, isPaginationFinished])
  useEffect(() => {
    if (!process.browser) {
      return 
    }
    if (user === null) {
      return 
    }
    // async function loadQuestions() {
    //   const db = getFirestore()
    //   const q = query(
    //     collection(db, 'questions'),
    //     where('receiverUid', '==', user.uid),
    //     orderBy('createdAt', 'desc')
    //   )
    //   const snapshot = await getDocs(q)
    //   if (snapshot.empty) {
    //     return
    //   }
    //   const gotQuestions = snapshot.docs.map(doc => {
    //     const question = doc.data() as Question
    //     question.id = doc.id
    //     return question
    //   })
    //   setQuestions(gotQuestions)
    // }
    loadQuestions()
  }, [process.browser, user])
  return (
    <Layout>
      <h1 className="h4">受け取った質問一覧</h1>
      <div className="row justify-content-center">
        <div className="col-12 col-md-6" ref={scrollContainerRef}>
          {questions.map(question => (
            <Link key={question.id} href={`/questions/${question.id}`}>
              <a>
                <div className="card my-3">
                  <div className="card-body">
                    <div className="text-truncate">{question.body}</div>
                    <div className="text-muted text-end mt-2">
                      <small>{dayjs(question.createdAt.toDate()).format('YYYY/MM/DD HH:mm')}</small>
                    </div>
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}