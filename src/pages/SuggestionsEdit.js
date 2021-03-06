import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { withRouter, Link, useHistory,useParams } from "react-router-dom"
import ImageUpload from '../assets/images/ImageUpload.png'
const Wrapper = styled.div`
width:100%;
display:flex;
padding-top:4vh;
@media screen and (max-width:650px) {
    flex-direction:column;
}
`
const Board = styled.div`
display:flex;
flex-direction:column;
@media screen and (max-width:650px) {
    width:93% !important;
}
`
const Table = styled.table`
width:100%;
border-collapse : collapse;
border-spacing : 0;
`
const Tr = styled.tr`
width:100%;
height:5vh;
border-top: 1px solid black;
border-bottom: 1px solid black;
word-break: break-all;
`
const Td = styled.td`
text-align:center;
width:12%;
`
const Td2 = styled.td`
text-align:center;
width:12%;
border-left: 1px solid black;
border-right: 1px solid black;
`
const InputBox = styled.div`
display: flex;
width:100%;
justify-content:space-between;
margin-bottom:2vh;
`
const InputContent = styled.div`
width:45%;
display: flex;
border-collapse : collapse;
border-spacing : 0;
height: 5vh;
background: #C9C9C9;
`
const InputName = styled.div`
border:1px solid black;
width:33%;
text-align:center;
font-size:2vh;
padding-top:0.5vh;
font-weight:bold;
@media screen and (max-width:950px) {
    font-size:1vh;
}
`
const BusInfor = styled.div`
border:1px solid black;
width:67%;
background: #C9C9C9;
padding-left:2vw;
outline:none;
font-size:2vh;
padding-top:0.7vh;
align-items:center;
@media screen and (max-width:950px) {
    font-size:1vh;
}
`
const Input = styled.input`
border:1px solid black;
width:67%;
background: #C9C9C9;
outline:none;
font-size:2vh;
@media screen and (max-width:950px) {
    font-size:1vh;
}
`
const SuggestionsEdit = () => {
    const history = useHistory();
    const params = useParams();
    const [content, setContent] = useState(undefined)
    const [img, setImg] = useState(undefined)
    const [url, setUrl] = useState('')

    const [saveImg, setSaveImg] = useState('');

    const [historyPosts, setHistoryPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stopName, setStopName] = useState('')
    const [stopId, setStopId] = useState('')
    const [createBy, setCreateBy] = useState('');

    const [displayArr, setDisplayArr] = useState([]);
    const [displayCount, setDisplayCount] = useState(0);

    const [date, setDate] = useState('')
    const [initiated, setInitiated] = useState('')
    const [org, setOrg] = useState('')
    const [formData] = useState(new FormData())

    const [amenity1, setAmenity1] = useState('')
    const [amenity2, setAmenity2] = useState('')
    const [amenity3, setAmenity3] = useState('')
    const [amenity4, setAmenity4] = useState('')
    const [amenity5, setAmenity5] = useState('')

    const [note1, setNote1] = useState('')
    const [note2, setNote2] = useState('')
    const [note3, setNote3] = useState('')
    const [note4, setNote4] = useState('')
    const [note5, setNote5] = useState('')

    const [status1, setStatus1] = useState('Started')
    const [status2, setStatus2] = useState('Started')
    const [status3, setStatus3] = useState('Started')
    const [status4, setStatus4] = useState('Started')
    const [status5, setStatus5] = useState('Started')

    let pushArr = [];
    const [pushHistory, setPushHistory] = useState([]);

    const isAdmin = async () => {

        const { data: response } = await axios.get('/api/auth')
        if (!response.pk) {
            history.push('/')
        }
    }

    useEffect(() => {
        isAdmin()
        console.log(params.pk)
    }, [])
    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            const { data: response } = await axios.get(`/api/onestation/${params.pk}/ATLDOT`);
            console.log(response.data)
            console.log(params.pk)
            if (response.data.modify == 0) {
                history.push('/suggestions')
                setLoading(false);
            }
            else {
                setStopName(response.data.stop_name);
                setStopId(response.data.stop_id)
                setCreateBy(response.data.create_by)
                let today = new Date();
                let month = today.getMonth() + 1;
                let date = today.getDate();
                const { data: res } = await axios.get('/api/auth')
                setDate(month + '/' + date)
                setInitiated(res.name)
                setOrg(res.organization)
                for (var i = 0; i < 6; i++) {
                    displayArr[i] = 'none'
                    if (i == 5) {
                        displayArr[i] = ''
                    }
                }
                const { data: reslist } = await axios.get(`/api/suggestions/${params.pk}`)
                setHistoryPosts(reslist.data);
                const { data: resimg } = await axios.get(`/api/image/${params.pk}/ATLDOT`)
                if (resimg.data) {
                    setSaveImg(resimg.data.image_src)
                }
                setLoading(false);
            }
        }
        fetchPosts()
    }, [])
    const addFile = (e) => {
        setContent(e.target.files[0]);
        setUrl(URL.createObjectURL(e.target.files[0]))
    };
    const onChangeCreateBy = (e) => {
        setCreateBy(e.target.value)
    }

    function plusDisplay() {
        displayArr[displayCount] = '';
        setDisplayCount(displayCount + 1)
        if (displayCount == 4) {
            displayArr[5] = 'none'
        }
    }
    const upLoad = async (e) => {
        e.preventDefault()
        if (url !== '') {
            let currentFile = content
            setImg(currentFile)
            formData.append("image", currentFile)
            formData.append("pk", params.pk)
            formData.append("org", org)
            const config = {
                header: {
                    'Content-Amenity': 'multipart/form-data; charset=UTF-8',
                    'Accept': '*/*'
                }
            }
            const response = await axios.post('/api/addimage', formData, config)
        }

        if (pushHistory.length) {

            let string = JSON.stringify(pushHistory);
            console.log(pushHistory)
            axios.post('/api/addproblem', {
                pk: params.pk,
                list: string
            })
            console.log(pushHistory)
        }
        const response = await axios.post('/api/updatecreate', {
            create: createBy,
            pk: params.pk,
            org: org
        })
        alert('Complete.')
        history.push('/suggestions')
    }
    const onChangeAmenity1 = (e) => {
        setAmenity1(e.target.value)
    }
    const onChangeAmenity2 = (e) => {
        setAmenity2(e.target.value)
    }
    const onChangeAmenity3 = (e) => {
        setAmenity3(e.target.value)
    }
    const onChangeAmenity4 = (e) => {
        setAmenity4(e.target.value)
    }
    const onChangeAmenity5 = (e) => {
        setAmenity5(e.target.value)
    }

    const onChangeStatus1 = (e) => {
        setStatus1(e.target.value)
        if (e.target.value == 'Complete'&&amenity1&&note1) {
            displayArr[0] = 'none'
            pushArr = pushHistory
            pushArr.push({
                date: date, initiated: initiated,
                org: org, amenity: amenity1, note: note1
            })
            setPushHistory(pushArr)
        }
        else if(e.target.value == 'Complete'&&(!amenity1||!note1)){
            alert('Do not leave blank')
            setStatus1('Started')
        }

    }
    const onChangeStatus2 = (e) => {
        setStatus2(e.target.value)
        if (e.target.value == 'Complete'&&amenity2&&note2) {
            displayArr[1] = 'none'
            pushArr = pushHistory
            pushArr.push({
                date: date, initiated: initiated,
                org: org, amenity: amenity2, note: note2
            })
            setPushHistory(pushArr)
        }
        else if(e.target.value == 'Complete'&&(!amenity2||!note2)){
            alert('Do not leave blank')
            setStatus2('Started')
        }
    }
    const onChangeStatus3 = (e) => {
        setStatus3(e.target.value)
        if (e.target.value == 'Complete'&&amenity3&&note3) {
            displayArr[2] = 'none'
            pushArr = pushHistory
            pushArr.push({
                date: date, initiated: initiated,
                org: org, amenity: amenity3, note: note3
            })
            setPushHistory(pushArr)
        }
        else if(e.target.value == 'Complete'&&(!amenity3||!note3)){
            alert('Do not leave blank')
            setStatus3('Started')
        }
    }
    const onChangeStatus4 = (e) => {
        setStatus4(e.target.value)
        if (e.target.value == 'Complete'&&amenity4&&note4) {
            displayArr[3] = 'none'
            pushArr = pushHistory
            pushArr.push({
                date: date, initiated: initiated,
                org: org, amenity: amenity4, note: note4
            })
            setPushHistory(pushArr)
        }
        else if(e.target.value == 'Complete'&&(!amenity4||!note4)){
            alert('Do not leave blank')
            setStatus4('Started')
        }
    }
    const onChangeStatus5 = (e) => {
        setStatus5(e.target.value)
        if (e.target.value == 'Complete'&&amenity5&&note5) {
            displayArr[4] = 'none'
            pushArr = pushHistory
            pushArr.push({
                date: date, initiated: initiated,
                org: org, amenity: amenity5, note: note5
            })
            setPushHistory(pushArr)
        }
        else if(e.target.value == 'Complete'&&(!amenity5||!note5)){
            alert('Do not leave blank')
            setStatus5('Started')
        }
    }

    const onChangeNote1 = (e) => {
        setNote1(e.target.value)
    }
    const onChangeNote2 = (e) => {
        setNote2(e.target.value)
    }
    const onChangeNote3 = (e) => {
        setNote3(e.target.value)
    }
    const onChangeNote4 = (e) => {
        setNote4(e.target.value)
    }
    const onChangeNote5 = (e) => {
        setNote5(e.target.value)
    }

    return (
        <Wrapper>
            {loading ?
                <div style={{ width: '100%', textAlign: 'center' }}>loading...</div>
                :
                <>
                    <Board style={{ width: '60%', marginLeft: '3vw', marginBottom: '3vh' }}>



                        <InputBox>
                            <InputContent>
                                <InputName>
                                    Stop Name
                                </InputName>
                                <BusInfor>
                                    {stopName}
                                </BusInfor>

                            </InputContent>
                            <InputContent>
                                <InputName>
                                    SID
                                </InputName>
                                <BusInfor>
                                    {stopId}
                                </BusInfor>

                            </InputContent>
                        </InputBox>

                        <InputBox style={{ marginBottom: '5vh' }}>
                            <InputContent>
                                <InputName>
                                    Created By
                                </InputName>
                                <Input value={createBy} onChange={onChangeCreateBy} style={{ paddingLeft: '2vw' }} />

                            </InputContent>
                            <InputContent>
                                <InputName>
                                    Address
                                </InputName>
                                <BusInfor>
                                    {stopId}
                                </BusInfor>

                            </InputContent>
                        </InputBox>
                        <div style={{ fontSize: '3vh' }}>
                            Non-Conformance
                        </div>
                        <Table>
                            <Tr style={{ fontWeight: 'bold' }}>
                                <Td style={{ borderLeft: '1px solid black' }}>Date</Td>
                                <Td>Initiated By</Td>
                                <Td>Org</Td>
                                <Td>Amenity</Td>
                                <Td>Status</Td>
                                <Td style={{ width: '40%', textAlign: 'left', borderRight: '1px solid black' }}>
                                    Notes
                                </Td>
                            </Tr>

                            <Tr style={{ background: '#E6E6E6', display: `${displayArr[0]}` }}>
                                <Td2>{date}</Td2>
                                <Td2>{initiated}</Td2>
                                <Td2>{org}</Td2>
                                <Td2>
                                    <Input style={{ background: '#E6E6E6', border: 'none' }}
                                        onChange={onChangeAmenity1} />
                                </Td2>
                                <Td2>
                                    <select style={{
                                        width: '100%', fontSize: '1vw',
                                        background: '#E6E6E6', border: 'none',
                                        outline: 'none'
                                    }}
                                        onChange={onChangeStatus1} value={status1}>
                                        <option>Started</option>
                                        <option>In Progress</option>
                                        <option>Complete</option>
                                    </select>
                                </Td2>
                                <Td2 style={{ width: '40%' }}>
                                    <Input style={{ background: '#E6E6E6', border: 'none' }}
                                        onChange={onChangeNote1} />
                                </Td2>
                            </Tr>
                            <Tr style={{ background: '#E6E6E6', display: `${displayArr[1]}` }}>
                                <Td2>{date}</Td2>
                                <Td2>{initiated}</Td2>
                                <Td2>{org}</Td2>
                                <Td2>
                                    <Input style={{ background: '#E6E6E6', border: 'none' }}
                                        onChange={onChangeAmenity2} />
                                </Td2>
                                <Td2>
                                    <select style={{
                                        width: '100%', fontSize: '1vw',
                                        background: '#E6E6E6', border: 'none',
                                        outline: 'none'
                                    }}
                                        onChange={onChangeStatus2} value={status2}>
                                        <option>Started</option>
                                        <option>In Progress</option>
                                        <option>Complete</option>
                                    </select>
                                </Td2>
                                <Td2 style={{ width: '40%' }}>
                                    <Input style={{ background: '#E6E6E6', border: 'none' }}
                                        onChange={onChangeNote2} />
                                </Td2>
                            </Tr>
                            <Tr style={{ background: '#E6E6E6', display: `${displayArr[2]}` }}>
                                <Td2>{date}</Td2>
                                <Td2>{initiated}</Td2>
                                <Td2>{org}</Td2>
                                <Td2>
                                    <Input style={{ background: '#E6E6E6', border: 'none' }}
                                        onChange={onChangeAmenity3} />
                                </Td2>
                                <Td2>
                                    <select style={{
                                        width: '100%', fontSize: '1vw',
                                        background: '#E6E6E6', border: 'none',
                                        outline: 'none'
                                    }}
                                        onChange={onChangeStatus3} value={status3}>
                                        <option>Started</option>
                                        <option>In Progress</option>
                                        <option>Complete</option>
                                    </select>
                                </Td2>
                                <Td2 style={{ width: '40%' }}>
                                    <Input style={{ background: '#E6E6E6', border: 'none' }}
                                        onChange={onChangeNote3} />
                                </Td2>
                            </Tr>
                            <Tr style={{ background: '#E6E6E6', display: `${displayArr[3]}` }}>
                                <Td2>{date}</Td2>
                                <Td2>{initiated}</Td2>
                                <Td2>{org}</Td2>
                                <Td2>
                                    <Input style={{ background: '#E6E6E6', border: 'none' }}
                                        onChange={onChangeAmenity4} />
                                </Td2>
                                <Td2>
                                    <select style={{
                                        width: '100%', fontSize: '1vw',
                                        background: '#E6E6E6', border: 'none',
                                        outline: 'none'
                                    }}
                                        onChange={onChangeStatus4} value={status4}>
                                        <option>Started</option>
                                        <option>In Progress</option>
                                        <option>Complete</option>
                                    </select>
                                </Td2>
                                <Td2 style={{ width: '40%' }}>
                                    <Input style={{ background: '#E6E6E6', border: 'none' }}
                                        onChange={onChangeNote4} />
                                </Td2>
                            </Tr>
                            <Tr style={{ background: '#E6E6E6', display: `${displayArr[4]}` }}>
                                <Td2>{date}</Td2>
                                <Td2>{initiated}</Td2>
                                <Td2>{org}</Td2>
                                <Td2>
                                    <Input style={{ background: '#E6E6E6', border: 'none' }}
                                        onChange={onChangeAmenity5} />
                                </Td2>
                                <Td2>
                                    <select style={{
                                        width: '100%', fontSize: '1vw',
                                        background: '#E6E6E6', border: 'none',
                                        outline: 'none'
                                    }}
                                        onChange={onChangeStatus5} value={status5}>
                                        <option>Started</option>
                                        <option>In Progress</option>
                                        <option>Complete</option>
                                    </select>
                                </Td2>
                                <Td2 style={{ width: '40%' }}>
                                    <Input style={{ background: '#E6E6E6', border: 'none' }}
                                        onChange={onChangeNote5} />
                                </Td2>
                            </Tr>


                        </Table>
                        <button style={{
                            marginBottom: '6vh', width: '100%', height: '5vh'
                            , border: '1px solid black', background: '#C4C4C4',
                            fontWeight: 'bold', fontSize: '1vw', cursor: 'pointer',
                            display: `${displayArr[5]}`
                        }}
                            onClick={() => { plusDisplay() }}>
                            + Add New Request</button>

                        <div style={{ fontSize: '3vh' }}>
                            Non-Conformance History
                        </div>
                        <Table>
                            <Tr style={{ fontWeight: 'bold' }}>
                                <Td style={{ borderLeft: '1px solid black' }}>Date</Td>
                                <Td>Name</Td>
                                <Td>Org</Td>
                                <Td>Amenity</Td>
                                <Td>Status</Td>
                                <Td style={{ width: '40%', textAlign: 'left', borderRight: '1px solid black' }}>
                                    Notes
                                </Td>
                            </Tr>
                            {historyPosts && historyPosts.map(post => (
                                <Tr style={{ background: '#E6E6E6' }} key={post.pk}>
                                    <Td2>{post.date}</Td2>
                                    <Td2>{post.name}</Td2>
                                    <Td2>{post.organization}</Td2>
                                    <Td2>{post.Amenity}</Td2>
                                    <Td2>{post.status}</Td2>
                                    <Td2 style={{ width: '40%' }}>{post.notes}</Td2>
                                </Tr>
                            ))}
                            {pushHistory && pushHistory.map(push => (
                                <Tr style={{ background: '#E6E6E6' }} key={push.pk}>
                                    <Td2>{push.date}</Td2>
                                    <Td2>{push.initiated}</Td2>
                                    <Td2>{push.org}</Td2>
                                    <Td2>{push.Amenity}</Td2>
                                    <Td2>Complete</Td2>
                                    <Td2 style={{ width: '40%' }}>{push.note}</Td2>
                                </Tr>

                            ))}
                        </Table>

                    </Board>
                    <Board style={{ width: '30%', marginLeft: '3vw' }}>

                        {url ? (
                            <>
                                <img src={url} alt="#"
                                    style={{
                                        width: '100%', height: '42vh',
                                        marginBottom: '6vh'
                                    }} />
                            </>
                        ) : (
                            saveImg ?
                                <label for="file">
                                    <img src={'http://localhost:8001' + saveImg}
                                        style={{
                                            width: '100%', height: '42vh',
                                            marginBottom: '6vh'
                                        }} />
                                </label>
                                :
                                <>
                                    <label for="file">
                                        <img src={ImageUpload}
                                            style={{
                                                width: '100%', height: '42vh',
                                                marginBottom: '6vh'
                                            }} />
                                    </label>

                                </>

                        )}
                        <div>
                            <input Amenity="file" id="file" onChange={addFile} style={{ display: 'none' }} />
                        </div>
                        <div style={{ fontSize: '3vh' }}>
                            Attached Files
                        </div>
                        <Table>
                            <Tr style={{ fontWeight: 'bold' }}>
                                <Td style={{ borderLeft: '1px solid black' }}>Date</Td>
                                <Td style={{ width: '15%' }}>Uploader</Td>
                                <Td style={{ width: '40%', textAlign: 'left', borderRight: '1px solid black' }}>
                                    Notes
                                </Td>
                            </Tr>
                            <Tr style={{ background: '#E6E6E6' }}>
                                <Td2>Date</Td2>
                                <Td2 style={{ width: '15%' }}>Initiated By</Td2>
                                <Td2 style={{ width: '24%' }}>Notes</Td2>
                            </Tr>

                        </Table>
                        <button style={{
                            marginBottom: '6vh', width: '100%', height: '5vh'
                            , border: '1px solid black', background: '#C4C4C4',
                            fontWeight: 'bold', fontSize: '1vw', cursor: 'pointer'
                        }}>+ Add New Request</button>

                        <div style={{ width: '100%', textAlign: 'end', marginBottom: '5vh' }}>
                            <button style={{
                                width: '60%', height: '5vh',
                                fontSize: '3vh', border: '1px solid black',
                                background: '#F6B60F', fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                                onClick={upLoad}>
                                Complete
                            </button>
                        </div>

                    </Board>
                </>
            }
        </Wrapper>
    );
};
export default SuggestionsEdit;