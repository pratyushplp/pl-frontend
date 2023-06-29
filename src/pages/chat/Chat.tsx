import { useRef, useState, useEffect } from "react";
import { Checkbox, Panel, DefaultButton, TextField, SpinButton } from "@fluentui/react";
import ajgLogo from '../../assets/ajgLogo.png'
import styles from "./Chat.module.css";

import { chatApi, Approaches, AskResponse, ChatRequest, ChatTurn } from "../../api";
import { Answer, AnswerError, AnswerLoading } from "../../components/Answer";
import { QuestionInput } from "../../components/QuestionInput";
import { ExampleList } from "../../components/Example";
import { UserChatMessage } from "../../components/UserChatMessage";
import { AnalysisPanel, AnalysisPanelTabs } from "../../components/AnalysisPanel";
import { ClearChatButton } from "../../components/ClearChatButton";
import { Modal,Button } from "antd";
import {config} from "../../Utils/Utils"
import {ExampleDatapoints,TestA} from "../../components/Example"
const Chat = () => {

    type objectProp =
{
  label:string|number
  value:string
}

    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
    const [promptTemplate, setPromptTemplate] = useState<string>("");
    const [retrieveCount, setRetrieveCount] = useState<number>(3);
    const [useSemanticRanker, setUseSemanticRanker] = useState<boolean>(true);
    const [useSemanticCaptions, setUseSemanticCaptions] = useState<boolean>(false);
    const [excludeCategory, setExcludeCategory] = useState<string>("");
    const [useSuggestFollowupQuestions, setUseSuggestFollowupQuestions] = useState<boolean>(false);

    const lastQuestionRef = useRef<string>("");
    const chatMessageStreamEnd = useRef<HTMLDivElement | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<unknown>();

    const [activeCitation, setActiveCitation] = useState<string>();
    const [activeAnalysisPanelTab, setActiveAnalysisPanelTab] = useState<AnalysisPanelTabs | undefined>(undefined);

    const [selectedAnswer, setSelectedAnswer] = useState<number>(0);
    const [answers, setAnswers] = useState<[user: string, response: AskResponse][]>([]);

    const [selectedFile, setSelectedFile] = useState<File|null>();
    //for example Datapoints
    const [selectedDatapoints, setSelectedDatapoints] = useState<objectProp[]>([])
    const [path, setPath] = useState<string|null>(null)

    const [modal, contextHolder] = Modal.useModal();

    // const makeApiRequest = async (question: string) => {
    //     lastQuestionRef.current = question;

    //     error && setError(undefined);
    //     setIsLoading(true);
    //     setActiveCitation(undefined);
    //     setActiveAnalysisPanelTab(undefined);

    //     try {
    //         const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
    //         const request: ChatRequest = {
    //             history: [...history, { user: question, bot: undefined }],
    //             approach: Approaches.ReadRetrieveRead,
    //             overrides: {
    //                 promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
    //                 excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
    //                 top: retrieveCount,
    //                 semanticRanker: useSemanticRanker,
    //                 semanticCaptions: useSemanticCaptions,
    //                 suggestFollowupQuestions: useSuggestFollowupQuestions
    //             }
    //         };
    //         const result = await chatApi(request);
    //         setAnswers([...answers, [question, result]]);
    //     } catch (e) {
    //         setError(e);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const makeApiRequest = async (question: string) => {

        if(!selectedFile)
        {
            modal.warning(config)
            // TO make sure questions cant be asked without attaching a document first
            return
        }

        lastQuestionRef.current = question;
        let temp_response={answer:"Policy number is 123 [1]. Effective date is 2022-1-1 [2].", thoughts:"", data_points: ["Policy_number","Effective_date"]}
        let temp = ["TestUser",temp_response]
        error && setError(undefined);
        setIsLoading(true);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);



        try {
            const history: ChatTurn[] = answers.map(a => ({ user: a[0], bot: a[1].answer }));
            const request: ChatRequest = {
                history: [...history, { user: question, bot: undefined }],
                approach: Approaches.ReadRetrieveRead,
                overrides: {
                    promptTemplate: promptTemplate.length === 0 ? undefined : promptTemplate,
                    excludeCategory: excludeCategory.length === 0 ? undefined : excludeCategory,
                    top: retrieveCount,
                    semanticRanker: useSemanticRanker,
                    semanticCaptions: useSemanticCaptions,
                    suggestFollowupQuestions: useSuggestFollowupQuestions
                }
            };
            // const result = await chatApi(request);
            // setAnswers([...answers, [question, result]]);
            let mock_result = {answer:"Policy number is 456 [1]. Effective date is 2023-1-1 [2].", thoughts:"", data_points: ["Policy_number","Effective_date"]}
            setAnswers([...answers, [question, mock_result]]);

        } catch (e) {
            setError(e);
        } finally {
            setIsLoading(false);
        }
    };




    const clearChat = () => {
        lastQuestionRef.current = "";
        error && setError(undefined);
        setActiveCitation(undefined);
        setActiveAnalysisPanelTab(undefined);
        setAnswers([]);
    };

    useEffect(() => chatMessageStreamEnd.current?.scrollIntoView({ behavior: "smooth" }), [isLoading]);

    const onPromptTemplateChange = (_ev?: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
        setPromptTemplate(newValue || "");
    };

    const onRetrieveCountChange = (_ev?: React.SyntheticEvent<HTMLElement, Event>, newValue?: string) => {
        setRetrieveCount(parseInt(newValue || "3"));
    };

    const onUseSemanticRankerChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticRanker(!!checked);
    };

    const onUseSemanticCaptionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSemanticCaptions(!!checked);
    };

    const onExcludeCategoryChanged = (_ev?: React.FormEvent, newValue?: string) => {
        setExcludeCategory(newValue || "");
    };

    const onUseSuggestFollowupQuestionsChange = (_ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean) => {
        setUseSuggestFollowupQuestions(!!checked);
    };

    const onExampleClicked = (example: string) => {
        makeApiRequest(example);
    };

    const onShowCitation = (citation: string, index: number) => {
        if (activeCitation === citation && activeAnalysisPanelTab === AnalysisPanelTabs.CitationTab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveCitation(citation);
            setActiveAnalysisPanelTab(AnalysisPanelTabs.CitationTab);
        }

        setSelectedAnswer(index);
    };

    const onToggleTab = (tab: AnalysisPanelTabs, index: number) => {
        if (activeAnalysisPanelTab === tab && selectedAnswer === index) {
            setActiveAnalysisPanelTab(undefined);
        } else {
            setActiveAnalysisPanelTab(tab);
        }

        setSelectedAnswer(index);
    };

    const onSelectedDatapoints=(value:objectProp[])=>
    {
        setSelectedDatapoints(value)
    }
    const onSelectedPath=(value:string|null)=>
    {
        setPath(value)
    }

    return (
        <div className={styles.container}>
            {contextHolder}
            <div className={styles.commandsContainer}>
                <ClearChatButton className={styles.commandButton} onClick={clearChat} disabled={!lastQuestionRef.current || isLoading} />
            </div>
            <div className={styles.chatRoot}>
                <div className={styles.chatContainer}>
                    {!lastQuestionRef.current ? (
                        <div className={styles.chatEmptyState}>
                            <div className={styles.logoContainer}>
                            {/* <img src={ajgLogo} alt="icon" className={styles.logo}/> */}
                            </div>
                            <h2 className={styles.chatEmptyStateTitle}>Chat with your data</h2>
                            <h3 className={styles.chatEmptyStateSubtitle}>Enter prompt or choose from below</h3>
                            {/* <ExampleList onExampleClicked={onExampleClicked} /> */}
                            {/* <ExampleCascader selectedQuestions = {selectedQuestions} setSelectedQuestions = {setSelectedQuestions}/> */}
                            <ExampleDatapoints selectedDatapoints= {selectedDatapoints} onSelectedDatapoints = {onSelectedDatapoints} path={path} onSelectedPath = {onSelectedPath}/>
                        </div>
                    ) : (
                        <div className={styles.chatMessageStream}>
                            {answers.map((answer, index) => (
                                <div key={index}>
                                    <UserChatMessage message={answer[0]} />
                                    <div className={styles.chatMessageGpt}>
                                        <Answer
                                            key={index}
                                            answer={answer[1]}
                                            isSelected={selectedAnswer === index && activeAnalysisPanelTab !== undefined}
                                            onCitationClicked={c => onShowCitation(c, index)}
                                            // onThoughtProcessClicked={() => onToggleTab(AnalysisPanelTabs.ThoughtProcessTab, index)}
                                            // onSupportingContentClicked={() => onToggleTab(AnalysisPanelTabs.SupportingContentTab, index)}
                                            // onFollowupQuestionClicked={q => makeApiRequest(q)}
                                            // showFollowupQuestions={useSuggestFollowupQuestions && answers.length - 1 === index}
                                        />
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <AnswerLoading />
                                    </div>
                                </>
                            )}
                            {error ? (
                                <>
                                    <UserChatMessage message={lastQuestionRef.current} />
                                    <div className={styles.chatMessageGptMinWidth}>
                                        <AnswerError error={error.toString()} onRetry={() => makeApiRequest(lastQuestionRef.current)} />
                                    </div>
                                </>
                            ) : null}
                            <div ref={chatMessageStreamEnd} />
                        </div>
                    )}

                    <div className={styles.chatInput}>
                        <QuestionInput
                            clearOnSend
                            placeholder="Type a question"
                            disabled={isLoading}
                            onSend={question => makeApiRequest(question)}
                            selectedFile={selectedFile}
                            setSelectedFile={setSelectedFile}
                        />
                    </div>
                </div>

                {answers.length > 0 && activeAnalysisPanelTab && (
                    <AnalysisPanel
                        className={styles.chatAnalysisPanel}
                        activeCitation={activeCitation}
                        onActiveTabChanged={x => onToggleTab(x, selectedAnswer)}
                        citationHeight="810px"
                        answer={answers[selectedAnswer][1]}
                        activeTab={activeAnalysisPanelTab}
                    />
                )}
            </div>
        </div>
    );
};

export default Chat;







// import {QuestionInput} from "../../components/QuestionInput"

// const onSend = (value: string)=> console.log(value)
// const Chat = () =>
// {
//     console.log("Chat")
//     return(<QuestionInput onSend={onSend} disabled={false} placeholder="hello"/>)
// }
// export default Chat
