'use client';
import { useEffect, useState } from 'react'
import s from './page.module.css'
import Button from '@/app/components/Button/Button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';


export default function Modify(){
    const [words, setWords] = useState<string[]>(JSON.parse(localStorage.getItem("words") ?? '""'))
    const { data: session } = useSession()

    useEffect(()=>{    
        async function getDBWords(){
            try{
                const response =  await fetch(`/api/words/${session?.user?.id}`)
                const responseJson = await response.json()

                setWords(responseJson.message)
            }catch(e){
                console.log("An error occurred when fetch words", e)
            }
        }
        if(session){
            setWords([])
            getDBWords()
        }
        
    }, [session])

    function deleteWord(word: string):void{
        const filteredWords = words.filter((element)=> element !== word)
        localStorage.setItem("words", JSON.stringify(filteredWords) )
        setWords(filteredWords)
    }


    const router = useRouter()

    return(
        <div className={s.container}>
            <div className="listSavedWords">
            {words && words.map((word: string | { word: string, id: string }) => {
                if (typeof word === 'string') {
                    return (
                    <div>
                        {session ? word : word}
                        <button onClick={() => deleteWord(word)}>Excluir</button>
                    </div>
                    )
                } else {
                    return (
                    <div key={word.id}>
                        {session ? word.word : word.word}
                        <button onClick={() => deleteWord(word.word)}>Excluir</button>
                    </div>
                    )
                }
                })}
                {!words && 
                <div>
                    <h1>Não há palavras no momento</h1>
                    <Button text="Adicione aqui" color="#0A3871" text_color="#fff" onClick={() => router.push('/words')} />
                </div>
                }
            </div>
        </div>
    )
}