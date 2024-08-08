from alembic import op
import sqlalchemy as sa

# Revision identifiers, used by Alembic.
revision = 'l8dig43423d5'
down_revision = '5a19143423c3'
branch_labels = None
depends_on = None

def upgrade():
    # Create the flash_challenge table
    op.create_table(
        'flash_challenge',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('startTime', sa.Integer(), nullable=True),
        sa.Column('endTime', sa.Integer(), nullable=True),
        sa.Column('shout', sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(['id'], ['challenges.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    # Drop the flash_challenge table
    op.drop_table('flash_challenge')

