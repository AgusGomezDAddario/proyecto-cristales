import { usePage, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

// 🔹 Interfaces para tipar datos que vienen del back
interface Role {
  id: number;
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
}

export default function UsersIndex() {
  const { users, roles } = usePage<UsersPageProps>().props;

  const { data, setData, post, put, delete: destroy, reset } = useForm({
    id: null as number | null,
    name: '',
    password: '',
    role_id: '',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (data.id) {
      put(`/admin/users/${data.id}`);
    } else {
      post('/admin/users');
    }
    reset();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gestión de Usuarios</h1>

      {/* 🔹 Formulario de Alta/Edición */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Nombre de usuario"
          value={data.name}
          onChange={e => setData('name', e.target.value)}
          required
          className="border rounded px-2 py-1 w-full"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={data.password}
          onChange={e => setData('password', e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
        <select
          value={data.role_id}
          onChange={e => setData('role_id', e.target.value)}
          required
          className="border rounded px-2 py-1 w-full"
        >
          <option value="">Seleccione un rol</option>
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.descripcion}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {data.id ? 'Actualizar' : 'Crear'}
        </button>
      </form>

      {/* 🔹 Tabla de Usuarios */}
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Usuario</th>
            <th className="border px-2 py-1">Rol</th>
            <th className="border px-2 py-1">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.id}</td>
              <td className="border px-2 py-1">{u.name}</td>
              <td className="border px-2 py-1">{u.role.descripcion}</td>
              <td className="border px-2 py-1">
                <button
                  onClick={() =>
                    setData({
                      id: u.id,
                      name: u.name,
                      password: '',
                      role_id: String(u.role_id),
                    })
                  }
                  className="mr-2 px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => destroy(`/admin/users/${u.id}`)}
                  className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
