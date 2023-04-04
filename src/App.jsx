import './App.css'
import {BrowserRouter as Router, Route, Routes, useParams} from 'react-router-dom'
import {Link} from 'react-router-dom'
import {useState, useEffect} from 'react'


function App() {

    /* useFetch--------------------------------------------------- */
    const useFetch = (url) => {
      const [data, setData] = useState(null)
      const [isPending, setIsPending] = useState(true)
  
        useEffect(() => {
          fetch(url)
            .then(res => {
              return res.json()
            })
            .then(data => {
              /* console.log(data) */
              setData(data) /* Once the data is taken from the json server it is set in the state */
              setIsPending(false) /* we set the pending state back to false once we have the data so there is no continuous loading sign */
            })
        }, [url])
  
        return {data, isPending}
      }
  /* End of useFetch--------------------------------------------------- */








  /* home section--------------------------------------------------- */
      function Home() {
        const {data: foods, isPending} = useFetch('http://localhost:8000/foods')

        return (
          <div className="home">
            { isPending && <div>loading...</div>} {/* conditional template */}
            {foods && <FoodList foods={foods} recipe={"My recipe list"}/>} {/* conditional template */}
            <Link className="new-recipe-link" to="/create">New Recipe</Link>
          </div>
        )
      }
    /* end of home--------------------------------------------------- */







  /* recipe list--------------------------------------------------- */
  function FoodList({foods, recipe}) {
    
    return (
      <div className="food-list">
        <h2>{recipe}</h2>
        {foods.map((food) => (
          <div className="food-preview" key={food.id}>

            <button className="delete-button" onClick={() => fetch('http://localhost:8000/foods/' + food.id, {method: 'DELETE'})
            .then(() => {window.location.reload(true)})}>
            Delete
            </button>

            <Link className="food-list-link" to={`/foods/${food.id}`}>
              <h2 className="food-list-name">{food.recipe}</h2>
              <h3 className="food-list-ingredients">Ingredients: {food.ingredients}</h3>
            </Link>
          </div>
        ))}
      </div>
    )
  }
  /* end of recipe list--------------------------------------------------- */









  /* recipe details------------------------------------------------------------------------------------------------------------ */
  function FoodDetails() {
    const {id} = useParams()
    const {data: food, isPending} = useFetch('http://localhost:8000/foods/' + id)
    const [edit, setEdit] = useState(false)
    const [recipe, setRecipe] = useState('')
    const [directions, setDirections] = useState('')
    const [ingredients, setIngredients] = useState('')
    const favorites = false
    const [favorite, setFavorite] = useState(false)

/* ---------------------------This changes the list to a new name, recipe, and ingredients, and also gives us a default of false for our favorite */
    const resubmit = (id, e) => {
      console.log(recipe, id)
      e.preventDefault()
      const food = {recipe, directions, ingredients, favorites}
      

      fetch('http://localhost:8000/foods/' + id, {
        method: 'PUT', 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(food)}).then(() => {window.location.reload(true)})
      setRecipe('')
      setDirections('')
      setIngredients('')
      setEdit(false)
      /* console.log(fetch('http://localhost:8000/foods/' + id)) */
    }


   /* ---------------------------allows us to change the data from true to false and vice versa */
    const myFavorite = (id) => {
      /* console.log(food.favorites) */
      /* console.log(id) */
      setFavorite(true)
      
      fetch('http://localhost:8000/foods/' + id,
      {method: 'PATCH',
       headers: {"Content-Type": "application/json"},
       body: JSON.stringify({favorites: favorite})})
       /* console.log(food.favorites) */
    }

    const notFavorite = (id) => {
      
      /* console.log(id) */
      setFavorite(false)
      /* console.log(food.favorites) */
      fetch('http://localhost:8000/foods/' + id, 
      {method: 'PATCH',
       headers: {"Content-Type": "application/json"},
       body: JSON.stringify({favorites: favorite})})
       /* console.log(food.favorites) */
    }

    

    
    /* ---------------------------Lets us enter into edit mode */
    const editRecipe = () => {
      setEdit(true)
    }

    const cancelChanges = () => {
      setEdit(false)
    }


   
    return (
      <div className="food-details">
        {isPending && <div>Loading...</div>}

        {food && (<div>

          {/* --------------------------------------------------Here we have our like, dislike, edit, link back to main page, with the ingredients, title, and directions */}
          
          {!edit && <div>
          {!favorite && <i className="fa-solid fa-star"></i>}
          <h2>{food.recipe}</h2>
          <h3 className="details-ingredients">Ingredients: {food.ingredients}</h3>
          <div className="details-directions">{food.directions}</div>

          <Link className="back-to-list" to="/">Back to List</Link>

          <button className="details-edit" onClick={editRecipe}>Edit</button>

          {!favorite && <button className="unlike" onClick={() => myFavorite(id)}>Unlike</button>} {/* has issues staying on its supposed star */}
          {favorite && <button className="like" value={favorite} onClick={() => notFavorite(id)}>Like</button>}

          </div>}
          
{/* --------------------------------------------------edit buttons and inputs */}
            {edit && <form className="edit" onSubmit={(e) => resubmit(food.id, e)}>
              
            <label>Recipe Name:</label>
              <input type="text" placeholder={food.recipe} value={recipe} onChange={(e) => setRecipe(e.target.value)}></input>

              <label>Directions:</label>
              <textarea value={directions} onChange={(e) => setDirections(e.target.value)}></textarea>

              <label>Ingredients:</label>
              <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)}></textarea>

              <button className="save">Save Changes</button>              
           </form>}
           {edit && <button className="cancel" onClick={cancelChanges}>Cancel</button>}

          

          {/* className="fa-solid fa-star" */}
            {/* className="fa-regular fa-star" */}

          </div>)}
      </div>
    )
  }
  /* end of recipe details----------------------------------------------------------------------------------------------------------- */








    /* creates a new recipe--------------------------------------------------- */
    function Create() {
      const [recipe, setRecipe] = useState('')
      const [directions, setDirections] = useState('')
      const [ingredients, setIngredients] = useState('')
      const [congrats, setCongrats] = useState(false)
      let favorites = false


      const handleSubmit = (e) => {
        e.preventDefault()
        const food = {recipe, directions, ingredients, favorites}
        /* const food = {recipe, directions, ingredients} */

        fetch('http://localhost:8000/foods', {
          method: 'POST', 
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(food)
        })
        setRecipe('')
        setDirections('')
        setIngredients('')
        setCongrats(true)
        /* console.log(food) */
      }

      return (
        <div className="create">
          <h2>Add a new recipe</h2>
            <form onSubmit={handleSubmit}>
              <label className="create-recipe-name">Recipe Name:</label>
              <input className="create-recipe-name-box" type="text" value={recipe} onClick={() => setCongrats(false)} onChange={(e) => setRecipe(e.target.value)}></input>

              <label className="create-recipe-directions">Directions:</label>
              <textarea className="create-recipe-directions-box" value={directions}  onClick={() => setCongrats(false)} onChange={(e) => setDirections(e.target.value)}></textarea>

              <label className="create-recipe-ingredients">Ingredients:</label>
              <textarea className="create-recipe-ingredients-box" value={ingredients}  onClick={() => setCongrats(false)} onChange={(e) => setIngredients(e.target.value)}></textarea>

              { congrats && <h3>The new recipe was Added!</h3>}

              <button className="create-button">Add Recipe</button>
            </form>

            <Link className="back-to-home" to="/">Back to Home</Link>
        </div>
      )
    }
    /* end of new Recipe--------------------------------------------------- */







  
  /* Main app return--------------------------------------------------- */
  return (
    <Router>
      <div className="App">
        <h1>My recipe App</h1>
        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/create" element={<Create />} />

          <Route path="/foods/:id" element={<FoodDetails />} />

        </Routes>
      </div>
    </Router>
  )
}

export default App

/* User should be able to view recipes
User should be able to add recipes
User should be able to edit recipes
User should be able to delete recipes
User should be able to favorite recipes */
