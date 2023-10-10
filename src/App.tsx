import {
    createBrowserRouter,
    RouterProvider,
    defer
   } from 'react-router-dom';

   import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';   

import { getPosts } from './posts/getPosts';
import { PostsPage } from './posts/PostsPage';
import { PostsPageForRouter } from './posts/PostsPageForRouter';
import { PostsPageForQuery } from './posts/PostsPageForQuery';
import { PostsPageForRRRQ } from './posts/PostsPageForRRRQ';

const queryClient = new QueryClient();

const router = createBrowserRouter([
    {
    path: "/",
    element: <PostsPageForRouter />,
    loader: async () => defer({ posts: getPosts() })
    }
   ]);

   const routerForQuery = createBrowserRouter([
    {
    path: "/",
    element: <PostsPageForQuery />,
    loader: async () => defer({ posts: getPosts() })
    }
   ]);

   const routerForRRRQ = createBrowserRouter([
    {
    path: "/",
    element: <PostsPageForRRRQ/>,
    loader: async () => {
        const existingData = queryClient.getQueryData([
        'postsDataRRRQ',
        ]);
        if (existingData) {
        return defer({ posts: existingData });
        }
        return defer({
        posts: queryClient.fetchQuery(
            ['postsDataRRRQ'],
            getPosts
            )
            });
        }       
    }
   ]);

function App() {
 return (
    <>
 <div className="flex space-x-3">
    <div>
 1. useEffect with fetch
<PostsPage />
</div>
<div>
    2. React Router with loader that send fetch request before component render
<RouterProvider router={router} />
</div>

<div>
    3. React Query<br/>
    will refetch when window regains focus
<QueryClientProvider client={queryClient}>
    <RouterProvider router={routerForQuery} />
 </QueryClientProvider>
 </div>

 <div>
    4. React Router & React Query<br/>
    use navigate('/') cause re-render after save
<QueryClientProvider client={queryClient}>
    <RouterProvider router={routerForRRRQ} />
 </QueryClientProvider>
 </div>

</div>
</>
 )
}


export default App;
