import { usePage, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import DashboardLayout from '@/layouts/DashboardLayout';


// 🔹 Interfaces para tipar datos que vienen del back
interface Role {
  role_id: number;
  descripcion: string;
}

interface User {
  id: number;
  name: string;
  role: Role;
  role_id: number;
}

// 🔹 Props que el backend envía con Inertia::render
interface UsersPageProps extends InertiaPageProps {
  users: User[];
  roles: Role[];
  flash?: string;
}

export default function UsersIndex() {
  const { users, roles, flash } = usePage<UsersPageProps>().props;

  const { data, setData, post, put, delete: destroy, reset, errors } = useForm({
    id: null as number | null,
    name: '',
    password: '',
    role_id: 0,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (data.id) {
      put(`/admin/users/${data.id}`, {
        onSuccess: () => reset(),
        onError: (errors) => console.error(errors),
      });
    } else {
      post('/admin/users', {
        onSuccess: () => reset(),
        onError: (errors) => console.error(errors),
      });
    }
  };

  return (
    <DashboardLayout title="Gestión de Usuarios">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Mensaje Flash */}
        {flash && (
          <div className="bg-green-100 text-green-800 border border-green-400 rounded p-3 mb-5 text-sm">
            {flash}
          </div>
        )}

        {/* Formulario */}
        <div className="bg-white shadow rounded-lg border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Alta / Edición</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                minLength={data.id ? undefined : 6}
                required={!data.id}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol del usuario
              </label>
              <select
                value={data.role_id}
                onChange={(e) => setData('role_id', Number(e.target.value))}
                required
                className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccione un rol</option>
                {roles.map((role) => (
                  <option key={role.role_id} value={role.role_id}>
                    {role.descripcion}
                  </option>
                ))}
              </select>
              {errors.role_id && (
                <p className="text-red-600 text-sm mt-1">{errors.role_id}</p>
              )}
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              {data.id ? 'Actualizar Usuario' : 'Crear Usuario'}
            </button>
          </form>
        </div>

        {/* Tabla de usuarios */}
        <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Usuario</th>
                <th className="px-4 py-2 border">Rol</th>
                <th className="px-4 py-2 border text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{u.id}</td>
                  <td className="border px-4 py-2">{u.name}</td>
                  <td className="border px-4 py-2">{u.role.descripcion}</td>
                  <td className="border px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() =>
                        setData({
                          id: u.id,
                          name: u.name,
                          password: '',
                          role_id: u.role_id,
                        })
                      }
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => destroy(`/admin/users/${u.id}`)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
