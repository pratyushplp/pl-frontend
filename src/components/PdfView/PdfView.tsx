import { useState } from "react";
import { Document, Page } from 'react-pdf';

import { PrimaryButton } from "@fluentui/react";
import { IconButton } from '@fluentui/react/lib/Button';

import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

interface Props {
    pageNum: number,
    pageLimit: number,
    pdfFilePath: string
}

export const PdfView = ({
    pageNum,
    pageLimit,
    pdfFilePath}: Props) =>
{
    let testPath='https://www.africau.edu/images/default/sample.pdf'
    type pdfPages= number|null
    let initialPageNumber = 1
    const [pageNumber, setPageNumber] = useState<number>(1)
    // const [numPages, setNumPages] = useState<pdfPages>(null)

    console.log(pdfFilePath)
    console.log(pageNum)
    console.log(pageLimit)

    const onDocumentLoadSuccess = (pageNumber: number)=>
    {
        console.log("success")
        setPageNumber(pageNumber)
        initialPageNumber=pageNumber
    }

    const changePage = (offset: number) :void =>
    {
        setPageNumber(prev=> prev+offset)
    }

    const test = () =>
    {
        let reader = new FileReader()
        // reader.readAsDataURL()
    }

    //TODO: Add forward and backward compatibility

    return(
        <>
        {/* <Document file={"/quantum.pdf"} onLoadSuccess={()=>onDocumentLoadSuccess(pageNum)}>
            <Page height={600} pageNumber={pageNumber} />
        </Document> */}
        <Document file={"/sample.pdf"} onLoadSuccess={()=>onDocumentLoadSuccess(pageNum)}>
        <Page height={600} pageNumber={pageNumber} />
        </Document>
        <p>Page number {pageNumber}</p>

        </>
    )

}