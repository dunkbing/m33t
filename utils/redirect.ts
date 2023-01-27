export const redirect = (location: string, body?: any) =>
  new Response(body, {
    status: 301,
    headers: new Headers({
      location,
    }),
  });
