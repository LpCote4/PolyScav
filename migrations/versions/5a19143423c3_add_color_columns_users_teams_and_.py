from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine.reflection import Inspector
from sqlalchemy import create_engine


# revision identifiers, used by Alembic.
revision = '5a19143423c3'
down_revision = 'a02c5bf43407'
branch_labels = None
depends_on = None


def table_exists(table_name, connection):
    inspector = Inspector.from_engine(connection)
    return table_name in inspector.get_table_names()

def column_exists(table_name, column_name, connection):
    inspector = Inspector.from_engine(connection)
    columns = [col['name'] for col in inspector.get_columns(table_name)]
    return column_name in columns

def index_exists(index_name, table_name, connection):
    inspector = Inspector.from_engine(connection)
    indexes = inspector.get_indexes(table_name)
    return any(index['name'] == index_name for index in indexes)


def upgrade():
    # Create an engine to connect to the database
    engine = create_engine('mysql+pymysql://ctfd:ctfd@db/ctfd')
    connection = engine.connect()

    # Check if the table exists before creating it
    if not table_exists('Medias', connection):
        op.create_table('Medias',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('thumbsnail', sa.Text(), nullable=True),
            sa.Column('content', sa.Text(), nullable=True),
            sa.Column('date', sa.DateTime(), nullable=True),
            sa.Column('user_id', sa.Integer(), nullable=True),
            sa.Column('team_id', sa.Integer(), nullable=True),
            sa.Column('challenge_id', sa.Integer(), nullable=True),
            sa.ForeignKeyConstraint(['team_id'], ['teams.id'], ),
            sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
            sa.PrimaryKeyConstraint('id')
        )

    if not table_exists('manual_challenge', connection):
        op.create_table('manual_challenge',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(['id'], ['challenges.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id')
        )

    if not table_exists('manual_recursive_challenge', connection):
        op.create_table('manual_recursive_challenge',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.ForeignKeyConstraint(['id'], ['challenges.id'], ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id')
        )

    if not column_exists('challenges', 'thumbsnail', connection):
        op.add_column('challenges', sa.Column('thumbsnail', sa.Text(), nullable=True))

    #if index_exists('challenge_id', 'solves', connection):
     #   op.drop_index('challenge_id', table_name='solves')
    #if index_exists('challenge_id_2', 'solves', connection):
    #    op.drop_index('challenge_id_2', table_name='solves')

    op.add_column('teams', sa.Column('color', sa.String(length=7), nullable=True))
    op.add_column('users', sa.Column('color', sa.String(length=7), nullable=True))

    # Close the connection
    connection.close()


def downgrade():
    op.drop_column('users', 'color')
    op.drop_column('teams', 'color')
#    op.create_index('challenge_id_2', 'solves', ['challenge_id', 'user_id'], unique=True)
#    op.create_index('challenge_id', 'solves', ['challenge_id', 'team_id'], unique=True)
    op.drop_column('challenges', 'thumbsnail')
    op.drop_table('manual_recursive_challenge')
    op.drop_table('manual_challenge')
    op.drop_table('Medias')
