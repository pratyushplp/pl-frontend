import { useMemo,useState } from "react";
import { Stack, StackItem} from "@fluentui/react";
import DOMPurify from "dompurify";
import styles from "./Answer.module.css";
import { AskResponse, getCitationFilePath } from "../../api";
import { parseAnswerToHtml } from "./AnswerParser";
import {LikeOutlined,DislikeOutlined} from "@ant-design/icons"
import {Button,Input} from "antd"

interface Props {
    answer: AskResponse;
    isSelected?: boolean;
    onCitationClicked: (filePath: string) => void;
}

export const Answer = ({
    answer,
    isSelected,
    onCitationClicked,
}: Props) => {

    console.log("Answer")

    const { TextArea } = Input;


    const [clickedList, setClickedList] = useState<boolean[]>([false,false])
    const [showFeedback, setShowFeedback] = useState<boolean>(false)
    const parsedAnswer = useMemo(() => parseAnswerToHtml(answer.answer, onCitationClicked), [answer]);

    const sanitizedAnswerHtml = DOMPurify.sanitize(parsedAnswer.answerHtml);

    const updateClickedList = (e:any) =>
    {
        console.log(e)
        // console.log(((e.target as HTMLButtonElement)))
        const index = e.currentTarget.value as unknown as number
        setClickedList((prev)=> prev.map((item,idx)=> idx==index?!item:item))
        console.log(index)
        console.log(clickedList)
    }
const feedbackClicked = (e:any) =>
{
    setShowFeedback((prev)=> !prev)
}

    return (
        <Stack className={`${styles.answerContainer} ${isSelected && styles.selected}`} verticalAlign="space-between">
            {!!parsedAnswer.citations.length && (
                <>
                <Stack.Item >
                    <p>
                        Hello World!
                    </p>
                </Stack.Item>
                <Stack.Item>
                    <Stack horizontal wrap tokens={{ childrenGap: 5 }}>
                        <span className={styles.citationLearnMore}>Citations:</span>
                        {parsedAnswer.citations.map((x, i) => {
                            const path = getCitationFilePath(x);
                            return (
                                <a key={i} className={styles.citation} title={x} onClick={() => onCitationClicked(path)}>
                                    {`${++i}. ${x}`}
                                </a>
                            );
                        })}
                    </Stack>
                </Stack.Item>
                <Stack.Item className={styles.extras}>
        <Button value={"0"} shape="circle" icon={<LikeOutlined/>}   onClick={updateClickedList} style={{backgroundColor: clickedList[0] ?"lightblue":"" }} />
        <div className={styles.rateButton}>
        <Button value={"1"} shape="circle" icon={<DislikeOutlined/>}  onClick={updateClickedList} style={{backgroundColor: clickedList[1]?"lightblue":"" }} />
        </div>
        </Stack.Item>
        <Stack.Item className={styles.feedback}>
            <Button onClick={feedbackClicked} className={styles.feedbackButton} style={{backgroundColor: showFeedback ?"lightblue":"" }}>
                Feedback
            </Button>
            {showFeedback &&
            <div >
            <TextArea rows={4} />
            <Button className={styles.feedbackSend} type="primary" size="small">send</Button>
            </div>}
        </Stack.Item>
                </>
            )}

        </Stack>
    );
};
