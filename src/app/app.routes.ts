import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login';
import { ProdutoListComponent } from './components/produto-list/produto-list';
import { ProdutoFormComponent } from './components/produto-form/produto-form';
import { ProdutoDetailComponent } from './components/produto-detail/produto-detail';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'produtos', component: ProdutoListComponent, canActivate: [authGuard] },
  { path: 'produtos/novo', component: ProdutoFormComponent, canActivate: [authGuard] },
  { path: 'produtos/:id', component: ProdutoDetailComponent, canActivate: [authGuard] },
  { path: 'produtos/:id/editar', component: ProdutoFormComponent, canActivate: [authGuard] },
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
