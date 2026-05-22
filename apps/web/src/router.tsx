import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { queryClient } from './common/lib/queryClient';
import { getSession } from './modules/auth/auth.api';

import NavBar from './common/components/NavBar';
import NotFound from './common/components/NotFound';

import CallbackPage from '@swap-web/modules/auth/pages/CallbackPage';
import CompleteProfilePage from '@swap-web/modules/auth/pages/CompleteProfilePage';
import LoginPage from '@swap-web/modules/auth/pages/LoginPage';

import FeedPage from '@swap-web/modules/feed/pages/FeedPage';

import ItemsPage from '@swap-web/modules/items/pages/ItemsPage';
import NewItemPage from '@swap-web/modules/items/pages/NewItemPage';
import ItemDetailPage from '@swap-web/modules/items/pages/ItemDetailPage';

import ConversationsPage from '@swap-web/modules/conversations/pages/ConversationsPage';
import ConversationDetailPage from '@swap-web/modules/conversations/pages/ConversationDetailPage';

import ProfilePage from '@swap-web/modules/profile/pages/ProfilePage';
import EditProfilePage from '@swap-web/modules/profile/pages/EditProfilePage';
import UserProfilePage from '@swap-web/modules/profile/pages/UserProfilePage';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFound,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'app',
  component: () => (
    <div>
      <NavBar />
      <Outlet />
    </div>
  ),
});

const requireAuth = async () => {
  if (import.meta.env.VITE_BYPASS_AUTH === 'true') return;

  let user;
  try {
    user = await queryClient.ensureQueryData({
      queryKey: ['session'],
      queryFn: getSession,
      retry: false,
    });
  } catch {
    throw redirect({ to: '/login' });
  }

  if (!user) throw redirect({ to: '/login' });

  if (!user.onboarded) throw redirect({ to: '/auth/complete-profile' });
};

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const callbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: CallbackPage,
});

const completeProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/complete-profile',
  component: CompleteProfilePage,
});

const feedRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/',
  beforeLoad: requireAuth,
  component: FeedPage,
});

const itemsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/items',
  beforeLoad: requireAuth,
  component: ItemsPage,
});

const newItemRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/items/new',
  beforeLoad: requireAuth,
  component: NewItemPage,
});

const itemDetailRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/items/$itemId',
  beforeLoad: requireAuth,
  component: ItemDetailPage,
});

const conversationsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/conversations',
  beforeLoad: requireAuth,
  component: ConversationsPage,
});

const conversationDetailRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/conversations/$conversationId',
  beforeLoad: requireAuth,
  component: ConversationDetailPage,
});

const profileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/profile',
  beforeLoad: requireAuth,
  component: ProfilePage,
});

const editProfileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/profile/edit',
  beforeLoad: requireAuth,
  component: EditProfilePage,
});

const userProfileRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: '/profile/$userId',
  beforeLoad: requireAuth,
  component: UserProfilePage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  callbackRoute,
  completeProfileRoute,
  appLayoutRoute.addChildren([
    feedRoute,
    itemsRoute,
    newItemRoute,
    itemDetailRoute,
    conversationsRoute,
    conversationDetailRoute,
    profileRoute,
    editProfileRoute,
    userProfileRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
