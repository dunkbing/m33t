export const redirect = (location: string, body?: any) =>
  new Response(body, {
    status: 302,
    headers: new Headers({
      location,
    }),
  });
