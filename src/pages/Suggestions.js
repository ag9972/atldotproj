import React from 'react'
import styled from 'styled-components'
import { useEffect, useState } from 'react';
import { withRouter, Link, useHistory } from "react-router-dom"
import axios from 'axios';
import imagesrc from '../assets/images/FileUpload.png'
import Bigarrow from '../assets/images/BigArrow.png'
import '../styles/style.css'
const Wrapper = styled.div`
    display: flex;
    width:100%;
    padding-top:2vh;
    justify-content: space-between;
`
const Board = styled.div`
width:45%;

`
const Img = styled.img`
width:1vw;
height:1.3vw;
`
const SearchBar = styled.input`
width:80%;
border:1px solid black;
outline:none;
`
const Table = styled.table`
width:100%;
border-collapse : collapse;
border-spacing : 0;
`
const Tr = styled.tr`
width:100%;
height:5vh;
border-bottom: 1px solid black;
word-break: break-all;
`
const SID = styled.td`
width:10%;
text-align:center;
border-left: 1px solid black;
font-size:1vw;
`
const Tier = styled.td`
width:13%;
text-align:center;
font-size:1vw;
`
const RidershipQuintile = styled.td`
width:17%;
text-align:center;
font-size:1vw;
`
const StopName = styled.td`
width:20%;
text-align:center;
font-size:1vw;
`
const Suggestions = styled.td`
width:23%;
text-align:center;
font-size:1vw;
`
const Modify = styled.td`
width:17%;
text-align:center;
border-left: 1px solid black;
border-right: 1px solid black;
font-size:1vw;
`
const Button = styled.button`
border-radius: 0.5vw;
border:none;
width:4vw;
height:3vh;
font-weight:bold;
font-size:0.8vw;
cursor:pointer;
@media screen and (max-width:950px) {
    width:6vw;
}
@media screen and (max-width:650px) {
    width:10vw;
}
`
const BigArrow = styled.img`
width:80%;
margin:16vh 0 10vh 0;
`
const SuggestionsPage = () => {
    const history = useHistory();
    const [posts, setPosts] = useState([]);
    const [modifyPosts, setModifyPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loading1, setLoading1] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [colorArr, setColorArr] = useState([]);
    const [search1, setSearch1] = useState('');
    const [search2, setSearch2] = useState('');
    const [page1, setPage1] = useState(0)
    const [page2, setPage2] = useState(0)

    const [filterTop200, setFilterTop200] = useState(0);
    const [filterTier, setFilterTier] = useState(0);
    const [filterRQ, setFilterRQ] = useState(0);
    const [filterIssue, setFilterIssue] = useState('');

    const [filterTop200Modify, setFilterTop200Modify] = useState(0);
    const [filterTierModify, setFilterTierModify] = useState(0);
    const [filterRQModify, setFilterRQModify] = useState(0);
    const [filterIssueModify, setFilterIssueModify] = useState('');
    
    const isAdmin = async () => {

        const { data: response } = await axios.get('/api/auth')
        console.log(response)
        if (!response.pk) {
            history.push('/')
        }
    }

    useEffect(() => {
        isAdmin()
    }, [])
    useEffect(() => {
        async function fetchPosts() {
            setLoading(true);
            const { data: response } = await axios.get(`/api/stations/ATLDOT/0?keyword=${search1}&page=${page1}`);
            setPosts(response.data);
            const { data: res } = await axios.get(`/api/stations/ATLDOT/1?keyword=${search2}&page=${page2}`);
            setModifyPosts(res.data)
            console.log(posts)
            console.log(modifyPosts)
            let arr = [];
            for(var i =0;i<posts.length;i++){
                if(posts[i].ridership_data>=45.7494){
                    arr[posts[i].pk]='#DAF1D6'
                    
                }
                else{
                    arr[posts[i].pk]='white'
                }
            }
            setColorArr(arr);
            setLoading(false);
        }
        fetchPosts()
    }, []);
    function onChangeModify(pk) {

        axios.post('/api/addmodify', {
            pk: pk,
            org: 'ATLDOT'
        }).then(() => {
            async function fetchPosts() {
                setLoading(true);
                const { data: response } = await axios.get(`/api/stations/ATLDOT/0?keyword=${search1}&page=${page1}`);
                setPosts(response.data);
                const { data: res } = await axios.get(`/api/stations/ATLDOT/1?keyword=${search2}&page=${page2}`);
                setModifyPosts(res.data)
                setLoading(false);
            }
            fetchPosts()
        })
    }
    function goEditPage(pk) {
        history.push(`/suggestionsedit/${pk}`)
    }
    const onChangeSearch1 = (e) => {
        setSearch1(e.target.value)
    }
    const onChangeSearch2 = (e) => {
        setSearch2(e.target.value)
    }
    function onChangePage1() {
        async function fetchPosts() {

            
                setLoading1(true);
                const { data: response } = await axios.get(`/api/stations/ATLDOT/0?keyword=${search1}&page=${page1}`);
                setPosts(response.data);
                const { data: res } = await axios.get(`/api/stations/ATLDOT/1?keyword=${search2}&page=${page2}`);
                setModifyPosts(res.data)
                setLoading1(false);
        }
        fetchPosts()
    };
    function onChangePage2() {
        async function fetchPosts() {

            setLoading2(true);
            const { data: response } = await axios.get(`/api/stations/ATLDOT/0?keyword=${search1}&page=${page1}`);
            setPosts(response.data);
            const { data: res } = await axios.get(`/api/stations/ATLDOT/1?keyword=${search2}&page=${page2}`);
            setModifyPosts(res.data)
            setLoading2(false);

        }
        fetchPosts()
    };
    return (
        <Wrapper>
            {
                loading ?
                    <div style={{ width: '100%', textAlign: 'center' }}>loading...</div>
                    :
                    <>

                        <Board style={{ marginLeft: '2vw' }}>
                            <div style={{
                                width: '100%', display: 'flex'
                                , justifyContent: 'space-between', paddingBottom: '0.5vh'
                            }}>
                                <Img src={imagesrc} />
                                <div style={{
                                    width: '60%'
                                    , display: 'flex', justifyContent: 'space-between'
                                }}>
                                    <div style={{ fontSize: '1vw' }}>Search</div>
                                    <SearchBar />
                                </div>
                            </div>
                            <Table>
                                <Tr style={{ height: '6vh', fontWeight: 'bold' }}>
                                    <SID style={{ border: '1px solid black' }}>SID</SID>
                                    <Tier style={{ border: '1px solid black' }}>Amenity<br/>Score</Tier>
                                    <RidershipQuintile style={{ border: '1px solid black' }}>
                                        Ridership<br />Quintile
                                    </RidershipQuintile>
                                    <StopName style={{ border: '1px solid black' }}>Stop Name</StopName>
                                    
                                    <Modify style={{ border: '1px solid black' }}>Modify</Modify>
                                </Tr>
                            </Table>
                            <div style={{height:'72vh',overflowY:'scroll'}} className='box'>
                            <Table>
                                
                                {posts && posts.map(post => (
                                    <Tr key={post.pk} style={{background:`${colorArr[post.pk]}`}}>
                                        <SID>{post.stop_id}</SID>
                                        <Tier>{post.tier}</Tier>
                                        <RidershipQuintile>{post.ridership_quintile}</RidershipQuintile>
                                        <StopName>{post.stop_name}</StopName>
                                        
                                        <Modify>
                                            <Button style={{ color: 'black', background: '#F6B60F' }}
                                                onClick={() => { onChangeModify(post.pk) }}>Add</Button>
                                        </Modify>
                                    </Tr>
                                ))}
                                

                            </Table>
                            </div>
                        </Board>
                        <div style={{
                            width: '5%', display: 'flex',
                            flexDirection: 'column', alignItems: 'center'
                        }}>
                            <BigArrow src={Bigarrow} />
                            <BigArrow src={Bigarrow} />
                        </div>
                        <Board style={{ marginRight: '2vw' }}>
                            <div style={{
                                width: '100%', display: 'flex'
                                , justifyContent: 'space-between', paddingBottom: '0.5vh'
                            }}>
                                <Img />
                                <div style={{
                                    width: '60%'
                                    , display: 'flex', justifyContent: 'space-between'
                                }}>
                                    <div style={{ fontSize: '1vw' }}>Search</div>
                                    <SearchBar />
                                </div>
                            </div>
                            <Table>
                                <Tr style={{ height: '6vh', fontWeight: 'bold' }}>
                                    <SID style={{ border: '1px solid black' }}>SID</SID>
                                    <Tier style={{ border: '1px solid black' }}>Amenity<br/>Score</Tier>
                                    <RidershipQuintile style={{ border: '1px solid black' }}>
                                        Ridership<br />Quintile
                                    </RidershipQuintile>
                                    <StopName style={{ border: '1px solid black' }}>Stop Name</StopName>
                                    <Suggestions style={{ border: '1px solid black' }}>Suggestions</Suggestions>
                                    <Modify style={{ border: '1px solid black' }}>Modify</Modify>
                                </Tr>

                                {modifyPosts && modifyPosts.map(post => (
                                    <Tr key={post.pk}>
                                        <SID>{post.stop_id}</SID>
                                        <Tier>{post.tier}</Tier>
                                        <RidershipQuintile>{post.ridership_quintile}</RidershipQuintile>
                                        <StopName>{post.stop_name}</StopName>
                                        <Suggestions>
                                            <Button style={{ color: 'white', background: '#107E7D', width: '80%' }}
                                            >{post.suggestions}</Button>

                                        </Suggestions>
                                        <Modify>
                                            <Button style={{ color: 'black', background: '#F6B60F' }}
                                                onClick={() => { goEditPage(post.pk) }}> {'>'} </Button>
                                        </Modify>
                                    </Tr>
                                ))}



                            </Table>
                        </Board>
                    </>
            }
        </Wrapper>
    );
};
export default SuggestionsPage;