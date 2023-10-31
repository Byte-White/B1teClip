import Image from 'next/image'
import Head from 'next/head';
import Clipboard from './clipboard'

export default function Home() {
  return (
    <div>
      <video autoPlay loop muted className="object-cover w-full h-full absolute inset-0">
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <Clipboard/>
    </div>
  )
}
