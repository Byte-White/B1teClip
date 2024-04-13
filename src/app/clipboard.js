"use client"
import React, { useState, useEffect } from 'react';

import { initializeApp } from "firebase/app";
import {getFirestore,collection,doc,getDoc,getDocs,addDoc,setDoc,deleteDoc, onSnapshot,serverTimestamp,query,orderBy} from "firebase/firestore"
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { library } from '@fortawesome/fontawesome-svg-core';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons'; // Updated icon import
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
library.add(faCopy);
//require('dotenv').config()

const firebaseConfig = {

  apiKey: process.env.NEXT_PUBLIC_API_KEY,

  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,

  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,

  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,

  messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,

  appId: process.env.NEXT_PUBLIC_APP_ID

};
const fire = initializeApp(firebaseConfig);
const db = getFirestore(fire);
const history = collection(db,'clipboard');
const current = doc(history,'current');


export default function Clipboard() {
  const [text, setText] = useState('');
  const [copyState, setCopyState] = useState('Copy');
  const [saveState, setSaveState] = useState('Save to History');
  const [tab, setTab] = useState(-1);
  const chooseLogInTab = () => {
    setTab(-1);
  }
  const chooseClipboardTab = () => {
    setTab(0);
  }
  const chooseHistoryTab = () => {
    setTab(1);
  }


  const [user, setUser] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const auth = getAuth();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      chooseClipboardTab();
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  const signOut = async () => {
    try {
      const auth = getAuth(); // Get the auth service
      await auth.signOut();
      setUser(null);
      chooseLogInTab();
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };
    
  const [documents, setDocuments] = useState([]);
  const refreshDocs = () =>{
      const fetchData = () => {
        const q = query(history, orderBy('createdAt', 'desc'));
        getDocs(q)
          .then((querySnapshot) => {
            const docs = [];
            querySnapshot.forEach((doc) => {
              if(doc.id != 'current')
              docs.push(doc);
            });
            setDocuments(docs);
          })
          .catch((error) => {
            console.error('Error fetching documents:', error);
          });
      };
    
      fetchData(); // Call fetchData inside the useEffect function body
    
    
    getDoc(current).then((doc) => {
      if (doc.exists) {
        // Document data is available in the `data()` method
        const data = doc.data();
        setText(data.data);
        } else {
          console.log('Document does not exist');
        }
      }).catch((error) => {
        console.error('Error getting document:', error);
      });
  }
  useEffect(() => {
    refreshDocs();
  }, []);
  //refreshDocs();
    // Use onSnapshot to listen for changes to the document
    onSnapshot(current, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if(data.data!=text)
        {
          setText(data.data);
          setCopyState('Copy');
          setSaveState('Save to History');
        }
      } else {
        console.log('Document does not exist');
      }
    });
    const handleChange = (e) => {
      setText(e.target.value)
      const newData = {
        data : e.target.value
        };
      setDoc(current, newData)
      setCopyState('Copy');
      setSaveState('Save to History');
    }
    
    
    const handleClear = () => {
      setText('')
      const newData = {
        data : ""
        };
      setDoc(current, newData);
      setCopyState('Copy');
      setSaveState('Save to History');
    }
    const handleCopy = () =>{
      if(text!='' && copyState != 'Copied!')
      {
        navigator.clipboard.writeText(text);
        setCopyState('Copied!');
      }
    }
    const handleSaveToHistory = () =>{
        if(text!='' && saveState != 'Saved!')
        {
          const doc_data = {
            data: text,
            createdAt:serverTimestamp()
          }
          addDoc(history, doc_data).then((docRef) => {
            console.log('Document written with ID: ', docRef.id);
            setSaveState("Saved!");
            refreshDocs();
          })
          .catch((error) => {
            console.error('Error creating document: ', error);
          });
        }
    }


    if(tab === -1){ //------------------------LogIn------------------------
      return(
        <div className="absolute inset-0 flex items-center flex-col overflow-y-auto bg-black bg-opacity-40">  
        <button className="bg-blue-500 w-1/2 text-white px-4 py-2 rounded-md" onClick={signInWithGoogle}>
        SIGN IN WITH GOOGLE
        </button>
        </div>
      )
    }
    else if(tab === 0){
    return (//---------------------CLIPBOARD-----------------------------
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="bg-black bg-opacity-40 rounded-lg w-2/3 p-8">
          <div className="absolute top-0 right-0 bg-green-600 rounded-lg p-1.5">
            <img src={user.photoURL} alt="Profile" className="w-16 h-16 rounded-full mb-2" />
            <div className="text-white font-bold">{user.displayName}</div>
            <div className="text-gray-300">{user.email}</div>            
            <button
              className="bg-red-500 text-white px-2 py-1 rounded-md"
              onClick={signOut}
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} />
            </button>
          </div>
          <div className="text-white text-3xl text-center mb-4">
          Clipboard
          </div>
          
          {/* Text Input */}
          <textarea
            type="text"
            className="w-full py-16 px-3 bg-transparent rounded-md"
            placeholder="Enter text..."
            value={text}
            onChange={(e) => handleChange(e)}
            ></textarea>

          {/* Copy and Save to History Buttons */}
          <div className="flex justify-between mt-4">
            <button className="bg-green-500 w-1/2 text-white px-4 py-2 rounded-md" onClick={handleCopy}>{copyState}</button>
            <button className="bg-white w-1/2 text-black px-4 py-2 rounded-md" onClick={handleSaveToHistory}>{saveState}</button>
          </div>

          {/* View History Button */}
          <button className="bg-blue-500 w-3/5 h-full text-white px-4 py-2 rounded-md mt-4" onClick={()=>chooseHistoryTab()}>History</button>
          <button className="bg-red-500 w-2/5 h-full text-white px-4 py-2 rounded-md mt-4" onClick={handleClear}>Clear</button>
        </div>
      </div>
    )
    }else if(tab === 1){//--------------------VIEW HISTORY-------------------------
      return(
        <div className="absolute inset-0 flex items-center flex-col overflow-y-auto">
            <button
              className="absolute top-4 left-4 bg-blue-500 text-white px-2 py-1 rounded-md"
              onClick={() => {
                chooseClipboardTab();
              }}>Back</button>
            {documents.map((document, index) => (
            <div className="bg-black bg-opacity-40 rounded-lg w-2/3 p-8 relative m-2">
              <h6 className='text-xs'>Date: {(document.data().createdAt.toDate().toString())}</h6>
              <br />
              <a>{document.data().data}</a>
              <div className="absolute right-4 bottom-4">
                <button className="bg-green-500 text-white px-2 py-1 rounded-md mr-2" onClick={()=>{navigator.clipboard.writeText(document.data().data)}}>
                <FontAwesomeIcon icon={['far', 'copy']} />
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded-md" onClick={
                  ()=>{
                    const docRef = doc(history,document.id)
                    deleteDoc(docRef).then(() => {
                      console.log('Document successfully deleted');
                      refreshDocs();
                    })
                    .catch((error) => {
                      console.error('Error deleting document: ', error);
                    });
                  }}>
                <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </div>))}
          </div>
      )
    }
    else{
      return (
        <div className="absolute inset-0 flex items-center flex-col overflow-y-auto">
          <h1>Something went wrong.</h1>
        </div>
      )
    }
  }