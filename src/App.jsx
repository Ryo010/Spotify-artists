import  './App.css'
import { FormControl, InputGroup, Container, Button, Card, Row } from  'react-bootstrap'
import { useState, useEffect } from  'react'
 
const  clientId  =  '82b8d578564d4855af5e121639808372';
const  clientSecret  =  '00718c6461034d9eb17139f76176ec59';

function  App() {
const [searchInput, setSearchInput] =  useState("")
const [accessToken, setAccessToken] =  useState("")
const [albums, setAlbums] =  useState([])

	useEffect(() => {
		var  authParams  = {
			method:  'POST',
			headers: {
			'Content-Type':  'application/x-www-form-urlencoded',
			},
			body:  'grant_type=client_credentials&client_id='  +  clientId  +  '&client_secret='  +  clientSecret,
			}
		fetch('https://accounts.spotify.com/api/token', authParams)
		.then(result  =>  result.json())
		.then(data  => {
		setAccessToken(data.access_token)
		
	})}, [])


  async  function  search() {
    var  artistParams  = {
      method:  'GET',
      headers: {
      'Content-Type':  'application/json',
      'Authorization':  'Bearer '  +  accessToken,
    },
  }
  
  // Get Artist
    var  artistID  =  await  fetch('https://api.spotify.com/v1/search?q='  +  searchInput  +  '&type=artist', artistParams)
      .then(result  =>  result.json())
      .then(data  => {
      return  data.artists.items[0].id
      })
  
  // Get Artist Top tracks
    await  fetch('https://api.spotify.com/v1/artists/'  +  artistID  +  '/top-tracks?include_groups=album&market=US&limit=50', artistParams
		
	)
    .then(result  =>  result.json())
    .then(data  => {
    setAlbums(data.tracks)
    })
    }
  

	return (
    <>
	<Container className='search-bar' style={{
    marginBottom:  '30px',
  }}>
		<InputGroup>
			<FormControl
			placeholder="Search For Artist"
			type='input'
			aria-label="Search for an Artist"
			onKeyDown={event  => {
			if (event.key === "Enter") {
			search()
			}
			}}
			onChange={event  =>  setSearchInput(event.target.value)}
			style={{
			width:  '300px',
			height:  '35px',
			borderWidth:  '0px',
			borderStyle:  'solid',
			borderRadius:  '5px',
			marginRight:  '10px',
			paddingLeft:  '10px',
			}}
			/>
			
			<Button  onClick={search}>
			Search
			</Button>

		</InputGroup>
	</Container>

  <Container >
	<Row  style={{
	 display:  'flex',
	 flexDirection:  'row',
	 flexWrap:  'wrap',
	 justifyContent:  'space-around',
	 alignContent:  'center',
 
	}}>
		{albums.map((album) => {
return(
<Card key={album.id} >
	
	<Card.Img  
	width={200}  
	src={album.album.images[0].url}  
	className='Cover-image'
	style={{
	borderRadius:  '4%',
	}}  />
	
	<Card.Body>
		<Card.Title  style={{
			whiteSpace:  'wrap',
			fontWeight:  'bold',
			maxWidth:  '200px',
			fontSize:  '18px',
			marginTop:  '10px',
			color:  'black'
			}}>{album.name}</Card.Title>
		
		<Card.Text  style={{
		color:  'black'
		}}>
		Release Date: <br/>  {album.album.release_date}
		</Card.Text>
		
		<Button  href={album.external_urls.spotify}  style={{
			backgroundColor:  'black',
			color:  'white',
			fontWeight:  'bold',
			fontSize:  '15px',
			borderRadius:  '5px',
			padding:  '10px',
			}}>Track Link
		</Button>
	</Card.Body>
</Card>
)

})}
	</Row>
</Container>
  </>
	)
}

export  default  App