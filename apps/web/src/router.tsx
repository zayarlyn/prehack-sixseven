import { createRouter, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { useAuthStore } from '@swap-web/modules/auth/store/authStore';

import NavBar from '@swap-web/common/components/NavBar';

import LoginPage from '@swap-web/modules/auth/pages/LoginPage';
import CallbackPage from '@swap-web/modules/auth/pages/CallbackPage';
import CompleteProfilePage from '@swap-web/modules/auth/pages/CompleteProfilePage';

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
  component: () => (
    <div>
      <NavBar />
      <Outlet />
    </div>
  ),
});

const requireAuth = () => {
  if ((import.meta as any).env?.VITE_BYPASS_AUTH === 'true') return;

  const { user } = useAuthStore.getState();
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
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: requireAuth,
  component: FeedPage,
});

const itemsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/items',
  beforeLoad: requireAuth,
  component: ItemsPage,
});

const newItemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/items/new',
  beforeLoad: requireAuth,
  component: NewItemPage,
});

const itemDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/items/$itemId',
  beforeLoad: requireAuth,
  component: ItemDetailPage,
});

const conversationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/conversations',
  beforeLoad: requireAuth,
  component: ConversationsPage,
});

const conversationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/conversations/$conversationId',
  beforeLoad: requireAuth,
  component: ConversationDetailPage,
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  beforeLoad: requireAuth,
  component: ProfilePage,
});

const editProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/edit',
  beforeLoad: requireAuth,
  component: EditProfilePage,
});

const userProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$userId',
  beforeLoad: requireAuth,
  component: UserProfilePage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  callbackRoute,
  completeProfileRoute,
  feedRoute,
  itemsRoute,
  newItemRoute,
  itemDetailRoute,
  conversationsRoute,
  conversationDetailRoute,
  profileRoute,
  editProfileRoute,
  userProfileRoute,
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
