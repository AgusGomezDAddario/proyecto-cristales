import { usePage, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';

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
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Gestión de Usuarios</h1>

      {flash && (
        <div className="bg-green-100 text-green-800 border border-green-400 rounded p-2 mb-3">
          {flash}
        </div>
      )}


      {/* 🔹 Formulario de Alta/Edición */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        {/* Nombre */}
        <div>
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            required
            className="border rounded px-2 py-1 w-full"
          />
          {errors.name && (
            <p className="text-red-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>
        {/* Contraseña */}
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={data.password}
            onChange={(e) => setData('password', e.target.value)}
            className="border rounded px-2 py-1 w-full"
            minLength={data.id ? undefined : 6} // obligatorio solo al crear
            required={!data.id}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Rol */}
        <div>
          <select
            value={data.role_id}
            onChange={(e) => setData('role_id', Number(e.target.value))}
            required
            className="border rounded px-2 py-1 w-full"
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
          {users.map((u) => (
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
                      role_id: u.role_id, // 👈 número, no string
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
