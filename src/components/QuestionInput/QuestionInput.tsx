import { useState } from "react";
import { Stack, TextField} from "@fluentui/react";
import { Modal } from "antd";
import { Send28Filled,Attach24Filled,ArrowUpload24Filled } from "@fluentui/react-icons";


import styles from "./QuestionInput.module.css";

interface Props {
    onSend(questions: string):void,
    disabled: boolean,
    placeholder?: string,
    clearOnSend?: boolean
}

//TODO: dont let the user ask question without uploading a document.
//Modal window telling to upload document
//How to make sure that the user only uploads pdf file

 export const QuestionInput = ({onSend, disabled, placeholder="Enter Prompt", clearOnSend}:Props) =>
{
    const [question, setQuestion] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [modal, contextHolder] = Modal.useModal();
    const config = {
        title: 'No document uploaded!',
        content: (
          <>
          <p>
            Please upload a document first.
          </p>
          </>
        ),
      };

    const sendQuestion = () =>
    {
        if(disabled || !question.trim())
        {
            return
        }
        if(!selectedFile)
        {
            modal.warning(config)
            //setIsModalOpen(true)
            return
        }

        onSend(question)

        if(clearOnSend){
            setQuestion("");
        }
    }

    const onEnterPress = (ev: React.KeyboardEvent<Element>) =>
    {
        if(ev.key === "Enter" && !ev.shiftKey)
        {
            ev.preventDefault();
            sendQuestion();
        }
    }

    const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        if (!newValue) {
            setQuestion("");
        } else if (newValue.length <= 1000) {
            setQuestion(newValue);
        }
    };

    const sendQuestionDisabled = disabled || !question.trim();

    const handleFileUpload = () => {
        if (selectedFile) {
          // Create a new FormData object
          const formData = new FormData();
          formData.append('file', selectedFile);
        }
    }

    const handleFileChange = (event:any) :void => {
            setSelectedFile(event.target.files[0]);
        };

    // const uploadFile = () =>
    // {
    //     var file = document.getElementById("myFile").files[0];
    //     console.log(file.name);
    // }

    return(
        <>
        {contextHolder}
        <Stack horizontal className={styles.questionInputContainer}>
            <div className={`${styles.questionAttachmentContainer}`}>
            <input type="file" onChange={handleFileChange} style={{display:'none'}} id="icon-button-file" accept=".pdf,.docx,.txt" />
            <label htmlFor="icon-button-file" className={styles.questionInputSendButton}>
            <ArrowUpload24Filled primaryFill="rgba(115, 118, 225, 1)" onClick={handleFileUpload}/>
            </label>
            </div>

            <TextField
                className={`${styles.questionInputTextArea} ${styles.questionInputSendButton}`}
                placeholder={placeholder}
                multiline
                resizable={false}
                borderless
                value={question}
                onChange={onQuestionChange}
                onKeyDown={onEnterPress}
            />
            <div className={styles.questionInputButtonsContainer}>
                <div
                    className={`${styles.questionInputSendButton} ${sendQuestionDisabled ? styles.questionInputSendButtonDisabled : ""}`}
                    aria-label="Ask question button"
                    onClick={sendQuestion}
                >
                    <Send28Filled primaryFill="rgba(115, 118, 225, 1)" />
                </div>
            </div>
        </Stack>
        </>
    )
}


