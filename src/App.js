// import './App.css';
// import Logintwo from './Component/Login/Logintwo';
// import { Routes, Route } from 'react-router-dom';
// import 'react-toastify/dist/ReactToastify.css';
// import Navbar from './Component/Navbar/Navbar';
// import RequireAuth from './Component/Auth/RequireAuth';
// import Home from './Component/Pages/Home';
// import SubmitIdea from './Component/Pages/SubmitIdea';
// import Moderation from './Component/Pages/Moderation';
// import MyIdeas from './Component/Pages/MyIdeas';
// import Analytics from './Component/Pages/Analytics';
// import Discussions from './Component/Pages/Discussions';

// function App() {



//   return (
//     <>
//       <Routes>
//         <Route path="/login" element={<Logintwo />} />

//         <Route
//           path="/"
//           element={
//             <RequireAuth>
//               <Navbar />
//             </RequireAuth>
//           }
//         >
//           {/* Nested Routes for main content */}
//           <Route path="/home" element={<Home />} />
//           <Route path="/my-ideas" element={<MyIdeas />} />
//           <Route path="/moderation" element={<Moderation />} />
//           <Route path="/submit" element={<SubmitIdea />} />
//           <Route path="/analytics" element={<Analytics />} />
//           <Route path="/discussions/:ideaId" element={<Discussions />} />
//           {/* Add more routes here */}
//         </Route>

//       </Routes>
//     </>
//   );


// }

// export default App;


import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './utils/Loader';

// Lazy-loaded components
const Logintwo = lazy(() => import('./Component/Login/Logintwo'));
const Navbar = lazy(() => import('./Component/Navbar/Navbar'));
const RequireAuth = lazy(() => import('./Component/Auth/RequireAuth'));
const Home = lazy(() => import('./Component/Pages/Home'));
const SubmitIdea = lazy(() => import('./Component/Pages/SubmitIdea'));
const Moderation = lazy(() => import('./Component/Pages/Moderation'));
const MyIdeas = lazy(() => import('./Component/Pages/MyIdeas'));
const Analytics = lazy(() => import('./Component/Pages/Analytics'));
const Discussions = lazy(() => import('./Component/Pages/Discussions'));

function App() {
  return (
    <Suspense fallback={<Loader/>}>
      <Routes>
        <Route path="/login" element={<Logintwo />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Navbar />
            </RequireAuth>
          }
        >
          {/* Nested Routes for main content */}
          <Route path="/home" element={<Home />} />
          <Route path="/my-ideas" element={<MyIdeas />} />
          <Route path="/moderation" element={<Moderation />} />
          <Route path="/submit" element={<SubmitIdea />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/discussions/:ideaId" element={<Discussions />} />
          {/* Add more routes here */}
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
